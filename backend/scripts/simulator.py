import docker
import time
import random
import sys
import os

# Append the parent directory to the path so we can import the app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import SessionLocal, engine, Base
from app.db.models import Resource, Telemetry, ActionLog

# 1. Initialize DB tables
print("Initializing State Ledger...")
Base.metadata.create_all(bind=engine)

# 2. Connect to Docker and DB
try:
    client = docker.from_env()
except docker.errors.DockerException:
    print("FATAL: Docker Desktop is not running. Please start it and try again.")
    sys.exit(1)

db = SessionLocal()

NUM_CONTAINERS = 10
active_containers = []

print(f"Spawning {NUM_CONTAINERS} Alpine containers in Docker...")

# Clear out old Docker containers to prevent naming conflicts
print("Sweeping old Docker containers...")
for c in client.containers.list(all=True):
    if c.name.startswith("idleaxe-demo-"):
        c.remove(force=True)

# Clear out the database for a clean hackathon demo run
print("Wiping the state ledger...")
db.query(ActionLog).delete()
db.query(Telemetry).delete()  # <-- CHILDREN DELETED FIRST
db.query(Resource).delete()   # <-- PARENT DELETED SECOND
db.commit()

for i in range(NUM_CONTAINERS):
    # 'tail -f /dev/null' keeps the container running indefinitely without doing anything
    container = client.containers.run(
        "alpine", 
        "tail -f /dev/null", 
        detach=True, 
        name=f"idleaxe-demo-{i}"
    )
    active_containers.append(container)

    # Register the asset in the FinOps ledger
    db_resource = Resource(
        container_id=container.id,
        name=container.name,
        status="ACTIVE"
    )
    db.add(db_resource)
    print(f"[+] Spawned {container.name} | ID: {container.id[:12]}")

db.commit()

print("\n[Simulator Active] Pumping hardware telemetry to PostgreSQL... (Press Ctrl+C to stop)")

try:
    while True:
        for idx, c in enumerate(active_containers):
            # Check if the Swarm has already terminated this container
            db_res = db.query(Resource).filter(Resource.container_id == c.id).first()
            if not db_res or db_res.status == "TERMINATED":
                continue

            # Generate Mock Telemetry:
            # Containers 0-6 simulate "Orphaned Waste" (CPU under 5%)
            # Containers 7-9 simulate "Critical Production" (CPU 40-85%)
            if idx < 7:
                cpu = random.uniform(0.1, 4.5)  
            else:
                cpu = random.uniform(40.0, 85.0) 

            mem = random.uniform(10.0, 50.0)

            telemetry = Telemetry(
                container_id=c.id,
                cpu_usage=cpu,
                memory_usage=mem
            )
            db.add(telemetry)
        
        db.commit()
        print(".", end="", flush=True)
        time.sleep(5) # Push telemetry every 5 seconds
        
except KeyboardInterrupt:
    print("\n[Simulator Halting] Cleaning up physical infrastructure...")
    for c in active_containers:
        try:
            c.remove(force=True)
            print(f"[-] Removed {c.name}")
        except Exception as e:
            pass
    db.close()
    print("Cleanup complete. Ready for next run.")