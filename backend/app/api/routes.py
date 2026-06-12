import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from app.db.database import SessionLocal
from app.db.models import Resource, Telemetry, ActionLog

router = APIRouter()

# Global state / process synchronization for Chaos Mode
CHAOS_STATE_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".chaos_mode")

def save_chaos_state(enabled: bool):
    try:
        with open(CHAOS_STATE_FILE, "w") as f:
            f.write("true" if enabled else "false")
    except Exception as e:
        print(f"Error saving chaos state: {e}")

def load_chaos_state() -> bool:
    try:
        if os.path.exists(CHAOS_STATE_FILE):
            with open(CHAOS_STATE_FILE, "r") as f:
                return f.read().strip().lower() == "true"
    except Exception as e:
        print(f"Error loading chaos state: {e}")
    return False

CHAOS_MODE_ACTIVE = load_chaos_state()

class ChaosState(BaseModel):
    enabled: bool


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Powers the main dashboard ticker."""
    total_resources = db.query(Resource).count()
    active = db.query(Resource).filter(Resource.status == "ACTIVE").count()
    terminated = db.query(Resource).filter(Resource.status == "TERMINATED").count()
    
    # Let's say every terminated container saves $45/month
    money_saved = terminated * 45 
    
    return {
        "total_resources": total_resources,
        "active_containers": active,
        "terminated_containers": terminated,
        "money_saved": money_saved
    }

@router.get("/logs")
def get_logs(db: Session = Depends(get_db)):
    """Powers the live, scrolling terminal feed."""
    logs = db.query(ActionLog).order_by(ActionLog.timestamp.desc()).limit(20).all()
    return logs

@router.get("/pending")
def get_pending_approvals(db: Session = Depends(get_db)):
    """Powers the Human-in-the-Loop approval queue."""
    pending = db.query(Resource).filter(Resource.status == "PENDING_APPROVAL").all()
    return pending

@router.post("/approve/{container_id}")
def approve_termination(container_id: str, db: Session = Depends(get_db)):
    """Allows the human to hit the 'Approve Axe' button in React."""
    resource = db.query(Resource).filter(Resource.container_id == container_id).first()
    
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    if resource.status != "PENDING_APPROVAL":
        raise HTTPException(status_code=400, detail="Resource is not pending approval")
        
    # Upgrade the status so the Guard Agent kills it on the next cycle
    resource.status = "MARKED_FOR_TERMINATION"
    
    # Log the human intervention
    db.add(ActionLog(
        container_id=container_id,
        agent_name="Human Override",
        action="Manual termination approved via Dashboard. Routing to Guard."
    ))
    db.commit()
    
    return {"status": "success", "message": "Execution authorized."}

@router.get("/chaos")
def get_chaos_state():
    global CHAOS_MODE_ACTIVE
    CHAOS_MODE_ACTIVE = load_chaos_state()
    return {"chaos_mode": CHAOS_MODE_ACTIVE}

@router.post("/chaos")
def toggle_chaos(state: ChaosState):
    global CHAOS_MODE_ACTIVE
    CHAOS_MODE_ACTIVE = state.enabled
    save_chaos_state(state.enabled)
    
    # Log the event for the frontend terminal to see
    db = SessionLocal()
    db.add(ActionLog(
        container_id="SYSTEM",
        agent_name="System Override",
        action=f"CHAOS MODE {'ENGAGED' if state.enabled else 'DISENGAGED'}. Injecting artificial CPU spikes."
    ))
    db.commit()
    db.close()
    
    return {"status": "success", "chaos_mode": CHAOS_MODE_ACTIVE}

@router.get("/resources")
def get_resources(db: Session = Depends(get_db)):
    """Powers the active resources grid with database-driven telemetry history."""
    resources = db.query(Resource).filter(Resource.status != "TERMINATED").all()
    result = []
    for r in resources:
        # Fetch the last 10 telemetry points for this container
        telemetries = db.query(Telemetry).filter(Telemetry.container_id == r.container_id).order_by(Telemetry.timestamp.desc()).limit(10).all()
        # Telemetry is in descending order, we want it in ascending order (chronological) for the chart
        cpu_history = [t.cpu_usage for t in reversed(telemetries)] if telemetries else [0.0]
        # Make sure we pad it if it has fewer than 5 elements so the sparkline has points
        if len(cpu_history) < 5:
            cpu_history = [0.0] * (5 - len(cpu_history)) + cpu_history
            
        result.append({
            "container_id": r.container_id,
            "name": r.name,
            "status": r.status,
            "waste_score": r.waste_score,
            "cpuHistory": cpu_history
        })
    return result

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(request: LoginRequest):
    """Simple admin credentials verification for the command plane."""
    correct_username = os.getenv("ADMIN_USERNAME", "admin")
    correct_password = os.getenv("ADMIN_PASSWORD", "idleaxe")
    
    if request.username == correct_username and request.password == correct_password:
        return {"status": "success", "message": "Authenticated successfully"}
        
    raise HTTPException(status_code=401, detail="Invalid username or password")