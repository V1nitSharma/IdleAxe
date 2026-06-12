from sqlalchemy.orm import Session
from app.db.models import Resource, Telemetry, ActionLog
from app.api.routes import load_chaos_state

def run_audit(db: Session):
    print("[Audit Agent] Scanning telemetry for idle/critical resources...")
    
    # Check if Chaos Mode is active
    is_chaos = load_chaos_state()
    
    # Fetch all currently active containers
    active_resources = db.query(Resource).filter(Resource.status == "ACTIVE").all()
    
    for res in active_resources:
        # Get the latest telemetry reading for this container
        latest_tel = db.query(Telemetry).filter(Telemetry.container_id == res.container_id).order_by(Telemetry.timestamp.desc()).first()
        
        if not latest_tel:
            continue
            
        # Flagging heuristics
        flag_for_waste = latest_tel.cpu_usage < 5.0
        flag_for_chaos = is_chaos or (latest_tel.cpu_usage > 80.0)
        
        if flag_for_waste or flag_for_chaos:
            res.status = "FLAGGED"
            
            # Formulate audit description
            if is_chaos:
                reason = f"SYSTEM OVERRIDE ENGAGED. Critical resource load detected (CPU {latest_tel.cpu_usage:.1f}%). Marked as FLAGGED."
            elif flag_for_chaos:
                reason = f"Spike Anomaly. CPU utilization critical at {latest_tel.cpu_usage:.1f}%. Marked as FLAGGED."
            else:
                reason = f"Idle Anomaly. CPU underutilized at {latest_tel.cpu_usage:.1f}%. Marked as FLAGGED."
                
            log_entry = ActionLog(
                container_id=res.container_id, 
                agent_name="Audit Agent", 
                action=reason
            )
            db.add(log_entry)
            
    db.commit()