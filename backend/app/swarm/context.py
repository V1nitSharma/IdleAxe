from sqlalchemy.orm import Session
from app.db.models import Resource, ActionLog
import random

def run_context(db: Session):
    print("[Context Agent] Analyzing Git/Engineering lifecycles for FLAGGED resources...")
    
    flagged = db.query(Resource).filter(Resource.status == "FLAGGED").all()
    
    for res in flagged:
        # For the hackathon demo, we simulate a mock LLM/Git heuristic analysis
        # returning a Waste Score from 50 to 100.
        waste_score = random.randint(50, 100)
        res.waste_score = waste_score

        if waste_score >= 80:
            res.status = "MARKED_FOR_TERMINATION"
            action_msg = f"High waste score ({waste_score}/100). Branch merged 5 days ago. No active connections. Routing to Guard."
        else:
            res.status = "PENDING_APPROVAL"
            action_msg = f"Ambiguous score ({waste_score}/100). Low traffic, but code lacks recent merge history. Requesting HITL approval."

        db.add(ActionLog(
            container_id=res.container_id, 
            agent_name="Context Agent", 
            action=action_msg
        ))
        
    db.commit()