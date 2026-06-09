from sqlalchemy.orm import Session
from app.db.models import Resource, Telemetry, ActionLog

def run_audit(db: Session):
    print("[Audit Agent] Scanning telemetry for idle resources...")
    
    # Fetch all currently active containers
    active_resources = db.query(Resource).filter(Resource.status == "ACTIVE").all()
    
    for res in active_resources:
        # Get the latest telemetry reading for this container
        latest_tel = db.query(Telemetry).filter(Telemetry.container_id == res.container_id).order_by(Telemetry.timestamp.desc()).first()
        
        # Heuristic: If the latest CPU usage is under 5%, flag it as potential waste
        if latest_tel and latest_tel.cpu_usage < 5.0:
            res.status = "FLAGGED"
            
            # Log the agent's thought process
            log_entry = ActionLog(
                container_id=res.container_id, 
                agent_name="Audit Agent", 
                action=f"Detected anomaly. CPU at {latest_tel.cpu_usage:.2f}%. Marked as FLAGGED."
            )
            db.add(log_entry)
            
    db.commit()