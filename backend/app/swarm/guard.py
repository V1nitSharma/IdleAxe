from sqlalchemy.orm import Session
from app.db.models import Resource, ActionLog
import docker

def run_guard(db: Session):
    print("[Optimization Guard] Executing physical infrastructure changes...")
    
    try:
        client = docker.from_env()
    except Exception:
        print("[Optimization Guard] ERROR: Cannot connect to Docker.")
        return

    # Find containers marked by the Swarm OR approved by the human
    targets = db.query(Resource).filter(Resource.status == "MARKED_FOR_TERMINATION").all()

    for res in targets:
        try:
            container = client.containers.get(res.container_id)
            container.stop() # Physically kill the container
            
            res.status = "TERMINATED"
            db.add(ActionLog(
                container_id=res.container_id, 
                agent_name="Guard Agent", 
                action="Physical Execution Success. Container stopped. Billing meter halted."
            ))
            print(f"[Optimization Guard] AXED Container: {res.container_id[:12]}")
            
        except docker.errors.NotFound:
            res.status = "TERMINATED"
            db.add(ActionLog(
                container_id=res.container_id, 
                agent_name="Guard Agent", 
                action="Container already missing. Synchronizing ledger."
            ))
        except Exception as e:
            print(f"[Optimization Guard] Error on {res.container_id}: {e}")

    db.commit()