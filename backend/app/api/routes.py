from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import SessionLocal
from app.db.models import Resource, Telemetry, ActionLog

router = APIRouter()

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