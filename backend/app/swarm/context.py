import json
import hashlib
import time
import logging
import re
import urllib.request
from typing import Optional
from sqlalchemy.orm import Session
from app.db.models import Resource, Telemetry, ActionLog
from openai import OpenAI
import openai
import os
from app.api.routes import load_chaos_state

# ─── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("ContextAgent")

# ─── ChatOps Webhook Dispatcher ──────────────────────────────────────────────
def send_chatops_ping(container_name: str, container_id: str, action: str, reason: str, priority: int):
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        log.info("[ChatOps] (Simulated Webhook) PENDING APPROVAL: Container '%s' (%s) requires authorization for action '%s'. Reason: %s", container_name, container_id[:8], action, reason)
        return
        
    color = 0xffa500 if priority == 2 else (0xff0000 if priority == 1 else 0x00ff00)
    payload = {
        "embeds": [{
            "title": "🪓 Human-In-The-Loop Authorization Request",
            "description": "The autonomous swarm engine has flagged a resource for authorization.",
            "color": color,
            "fields": [
                {"name": "Resource Name", "value": container_name, "inline": True},
                {"name": "Container ID", "value": container_id[:12], "inline": True},
                {"name": "LLM Recommendation", "value": action.upper(), "inline": True},
                {"name": "Priority", "value": f"P{priority}", "inline": True},
                {"name": "Reasoning Context", "value": reason, "inline": False}
            ],
            "footer": {"text": "IdleAxe swarm webhook agent"}
        }]
    }
    
    try:
        req = urllib.request.Request(
            webhook_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "User-Agent": "IdleAxe-Agent"}
        )
        with urllib.request.urlopen(req) as response:
            pass
        log.info("[ChatOps] Webhook dispatched to Discord/Slack.")
    except Exception as e:
        log.error("[ChatOps] Webhook dispatch error: %s", e)

# ─── Constants ──────────────────────────────────────────────────────────────
MODEL          = "meta/llama-3.1-8b-instruct"
MODEL_FALLBACKS = [
    "nvidia/llama-3.1-nemotron-70b-instruct",
    "meta/llama-3.1-70b-instruct",
    "mistralai/mistral-nemotron"
]
MAX_TOKENS     = 2048
MAX_RPM        = 40           # Nvidia/LLM rate limit reference ceiling
SAFETY_MARGIN  = 0.70         # Use <= 70% of quota
MAX_RETRIES    = 3            # Retry attempts on transient failures
BASE_BACKOFF   = 2.0          # Seconds; doubles each retry (2 -> 4 -> 8)


# ════════════════════════════════════════════════════════════════════════════
# STATE HASH CACHE
# ════════════════════════════════════════════════════════════════════════════

class StateHashCache:
    """
    Stores a SHA-256 fingerprint of each container's last-analyzed state.
    If the fingerprint hasn't changed -> skip -> zero tokens spent.
    """

    def __init__(self):
        self._cache: dict[str, str] = {}   # container_id -> last hash

    def _hash(self, state: dict) -> str:
        canonical = json.dumps(state, sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(canonical.encode()).hexdigest()

    def has_changed(self, container_id: str, current_state: dict) -> bool:
        """True if state differs from the last analyzed snapshot."""
        return self._cache.get(container_id) != self._hash(current_state)

    def update(self, container_id: str, state: dict) -> None:
        self._cache[container_id] = self._hash(state)

    def invalidate(self, container_id: str) -> None:
        """Force re-analysis next cycle (e.g. after a healing action)."""
        self._cache.pop(container_id, None)


# ════════════════════════════════════════════════════════════════════════════
# RATE-LIMIT GUARD (token bucket)
# ════════════════════════════════════════════════════════════════════════════

class RateLimitGuard:
    """
    Token-bucket enforcing safety ceilings.
    """

    def __init__(self, max_rpm: int = MAX_RPM, margin: float = SAFETY_MARGIN):
        self._capacity    = int(max_rpm * margin)   # 21
        self._tokens      = float(self._capacity)
        self._last_refill = time.monotonic()

    def _refill(self):
        now               = time.monotonic()
        elapsed           = now - self._last_refill
        new_tokens        = elapsed * (self._capacity / 60.0)
        self._tokens      = min(self._capacity, self._tokens + new_tokens)
        self._last_refill = now

    def acquire(self) -> bool:
        """Return True immediately if a token is available."""
        self._refill()
        if self._tokens >= 1:
            self._tokens -= 1
            return True
        return False

    def wait_and_acquire(self):
        """Block until a token is available."""
        while not self.acquire():
            wait = 60.0 / self._capacity
            log.warning("RateLimitGuard: bucket empty, sleeping %.1fs", wait)
            time.sleep(wait)


# ════════════════════════════════════════════════════════════════════════════
# BATCH PROMPT AND CLEANING
# ════════════════════════════════════════════════════════════════════════════

SYSTEM_PROMPT = """You are an autonomous DevOps healing agent.
You will receive a JSON array of flagged containers with live metrics.
Some containers may have failed previous execution attempts (indicated by "previous_execution_failed": true and a "failure_reason").
For EVERY container in the array respond with a JSON array of healing actions.

RULES — follow exactly:
- Output ONLY a valid JSON array. No prose, no markdown, no code fences.
- One element per container. Element schema:
  { "container_id": string, "action": string, "reason": string, "priority": int }
- Valid actions: restart | scale_up | scale_down | kill | alert_only | no_action
- priority: 1 = critical, 2 = warning, 3 = low
- reason: <= 20 words, plain English

REFLECTION RULES FOR FAILED EXECUTIONS:
- If "previous_execution_failed" is true, DO NOT recommend the "kill" action again.
- Instead, suggest "alert_only" or "scale_down" to notify engineers or reduce footprint, and explain your reflection reasoning (e.g., "Reflected on Docker stop failure; degrading to manual alert.")."""


def build_batch_prompt(flagged_containers: list[dict]) -> str:
    return json.dumps(flagged_containers, indent=2)


def _strip_json_fences(raw: str) -> str:
    cleaned = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("`").strip()
    return cleaned


# ════════════════════════════════════════════════════════════════════════════
# CONTEXT AGENT
# ════════════════════════════════════════════════════════════════════════════

class ContextAgent:
    """
    Receives flagged containers, dedupes using hashes, and calls NVIDIA LLM in batch.
    """

    def __init__(self, api_key: Optional[str] = None):
        key = api_key or os.getenv("NVIDIA_API_KEY")
        if not key:
            log.warning("NVIDIA_API_KEY not found in environment. Agent will run in simulated fallback mode.")
            self._client = None
        else:
            self._client = OpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=key
            )
        self._cache     = StateHashCache()
        self._guard     = RateLimitGuard()
        self._cycle_no  = 0
        self._stats     = {
            "total_api_calls":     0,
            "skipped_unchanged":   0,
            "containers_analyzed": 0,
            "fallbacks_used":      0,
        }

    def analyze_cycle(self, flagged_containers: list[dict]) -> list[dict]:
        self._cycle_no += 1
        log.info("━━━ Cycle %d | flagged=%d ━━━", self._cycle_no, len(flagged_containers))

        if not flagged_containers:
            return []

        # State Hashing filter (bypassed if Chaos Mode is active)
        needs_analysis = []
        is_chaos = load_chaos_state()
        if is_chaos:
            log.info("  [CHAOS ACTIVE] State cache hash invalidated. Forcing LLM audit on all containers.")
            
        for c in flagged_containers:
            if is_chaos or self._cache.has_changed(c["id"], c):
                needs_analysis.append(c)
            else:
                self._stats["skipped_unchanged"] += 1
                log.info("  [SKIP] %s — state unchanged", c["id"])

        skipped = len(flagged_containers) - len(needs_analysis)
        if not needs_analysis:
            log.info("  ✓ All %d flagged containers unchanged — skipping API call.", len(flagged_containers))
            return []

        log.info(
            "  Flagged: %d | Skipped: %d | Analyzing: %d",
            len(flagged_containers), skipped, len(needs_analysis)
        )

        # Call LLM with retry/fallback
        self._guard.wait_and_acquire()
        actions = self._call_llm_batch_with_retry(needs_analysis)

        # Update cache for analyzed containers
        for c in needs_analysis:
            self._cache.update(c["id"], c)

        self._stats["total_api_calls"]     += 1
        self._stats["containers_analyzed"] += len(needs_analysis)
        return actions

    def _call_llm_batch_with_retry(self, containers: list[dict]) -> list[dict]:
        if not self._client:
            log.warning("No client configured, degrading to fallback alerts.")
            self._stats["fallbacks_used"] += 1
            return self._fallback_actions(containers)

        delay = BASE_BACKOFF
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                return self._call_llm_batch(containers)

            except openai.RateLimitError:
                wait = 15 * attempt
                log.error("  [Attempt %d/%d] Rate limit hit — sleeping %ds", attempt, MAX_RETRIES, wait)
                time.sleep(wait)

            except (openai.APIConnectionError, openai.APITimeoutError) as exc:
                log.warning("  [Attempt %d/%d] Connection/Timeout error — retrying in %.0fs", attempt, MAX_RETRIES, delay)
                time.sleep(delay)
                delay *= 2

            except openai.APIStatusError as exc:
                if exc.status_code in (500, 529, 502, 503, 504):
                    log.warning("  [Attempt %d/%d] Server error %d — retrying in %.0fs", attempt, MAX_RETRIES, exc.status_code, delay)
                    time.sleep(delay)
                    delay *= 2
                else:
                    log.error("  Unrecoverable API error %d: %s", exc.status_code, exc)
                    break

        self._stats["fallbacks_used"] += 1
        return self._fallback_actions(containers)

    def _call_llm_batch(self, containers: list[dict]) -> list[dict]:
        prompt = build_batch_prompt(containers)
        
        models_to_try = [MODEL] + MODEL_FALLBACKS
        last_error = None
        
        for model in models_to_try:
            try:
                log.info("  Attempting LLM batch call using model: %s", model)
                response = self._client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2,
                    max_tokens=MAX_TOKENS,
                )
                raw = response.choices[0].message.content.strip()
                clean = _strip_json_fences(raw)
                
                actions = json.loads(clean)
                if not isinstance(actions, list):
                    raise ValueError("LLM response must be a JSON list.")
                log.info("  ✓ LLM returned %d action(s) using model %s.", len(actions), model)
                return actions
            except Exception as exc:
                last_error = exc
                log.warning("  Model %s invocation failed: %s. Trying next fallback model...", model, exc)
                continue
                
        log.error("  All configured models failed. Last error: %s", last_error)
        raise last_error

    @staticmethod
    def _fallback_actions(containers: list[dict]) -> list[dict]:
        log.warning("  ⚠ Fallback activated — alert_only for %d container(s).", len(containers))
        return [
            {
                "container_id": c["id"],
                "action": "alert_only",
                "reason": "LLM unavailable after retries — manual review required",
                "priority": 1,
            }
            for c in containers
        ]

    def invalidate_cache(self, container_id: str):
        self._cache.invalidate(container_id)


# Global instance of ContextAgent
agent = ContextAgent()


# ════════════════════════════════════════════════════════════════════════════
# SWARM INTERFACE
# ════════════════════════════════════════════════════════════════════════════

def run_context(db: Session):
    print("[Context Agent] Analyzing Git/Engineering lifecycles for FLAGGED / FAILED resources...")

    flagged_resources = db.query(Resource).filter(
        (Resource.status == "FLAGGED") | (Resource.status == "EXECUTION_FAILED")
    ).all()
    
    if not flagged_resources:
        print("[Context Agent] No FLAGGED or FAILED resources to analyze.")
        return

    # Build snapshots
    flagged_snapshots = []
    for res in flagged_resources:
        latest_tel = db.query(Telemetry).filter(Telemetry.container_id == res.container_id).order_by(Telemetry.timestamp.desc()).first()
        cpu = latest_tel.cpu_usage if latest_tel else 0.0
        mem = latest_tel.memory_usage if latest_tel else 0.0
        
        # Check if previous execution failed
        prev_failed = res.status == "EXECUTION_FAILED"
        failure_reason = None
        if prev_failed:
            latest_fail_log = db.query(ActionLog).filter(
                (ActionLog.container_id == res.container_id) & 
                (ActionLog.action.like("ACTUATION FAILURE:%"))
            ).order_by(ActionLog.timestamp.desc()).first()
            if latest_fail_log:
                failure_reason = latest_fail_log.action
        
        # Deterministically assign restarts based on ID
        restarts = hash(res.container_id) % 3
        flagged_snapshots.append({
            "id": res.container_id,
            "name": res.name,
            "cpu_pct": round(cpu, 1),
            "mem_pct": round(mem, 1),
            "restarts": restarts,
            "status": "running" if not prev_failed else "execution_failed",
            "flagged": True,
            "previous_execution_failed": prev_failed,
            "failure_reason": failure_reason
        })

    # Call optimized cache & LLM batch cycle
    actions = agent.analyze_cycle(flagged_snapshots)

    # Process results back to DB
    for act in actions:
        cid = act.get("container_id")
        action = act.get("action", "no_action")
        reason = act.get("reason", "No explanation provided.")
        priority = act.get("priority", 3)

        res = db.query(Resource).filter(Resource.container_id == cid).first()
        if not res:
            continue

        # Map actions to SQL ledger states
        if action == "kill":
            res.status = "MARKED_FOR_TERMINATION"
            res.waste_score = 90
            action_msg = f"High waste / LLM Kill recommendation. Reason: {reason} Routing to Guard."
            agent.invalidate_cache(cid)
        elif action == "no_action":
            res.status = "ACTIVE"
            res.waste_score = 15
            action_msg = f"LLM determined resource is active. Reason: {reason} Cleared from flagged list."
            agent.invalidate_cache(cid)
        else: # restart | scale_up | scale_down | alert_only
            res.status = "PENDING_APPROVAL"
            res.waste_score = 65
            action_msg = f"LLM recommended {action.upper()} (Priority P{priority}). Reason: {reason} Requesting HITL approval."
            agent.invalidate_cache(cid)
            # Dispatch ChatOps alert notification
            send_chatops_ping(res.name or "zombie-container", cid, action, reason, priority)

        # Log to ActionLog so the React Scrolling feed updates live
        db.add(ActionLog(
            container_id=cid,
            agent_name="Context Agent",
            action=action_msg
        ))

    db.commit()