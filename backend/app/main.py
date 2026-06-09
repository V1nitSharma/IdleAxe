import asyncio
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database import SessionLocal, engine, Base
from .swarm.audit import run_audit
from .swarm.context import run_context
from .swarm.guard import run_guard
from .api import routes

# Ensure database tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(title="IdleAxe Control Plane")

# Allow requests from the Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(routes.router, prefix="/api")
async def swarm_loop():
    """The infinite, autonomous FinOps loop (Async Safe)."""
    await asyncio.sleep(3) # Give FastAPI a moment to boot before starting
    print("\n[System] Swarm Engine Online. Entering Autonomous Loop.")
    
    while True:
        db = SessionLocal()
        try:
            print("\n--- Swarm Cycle Initiated ---")
            run_audit(db)
            run_context(db)
            run_guard(db)
            print("--- Swarm Cycle Complete ---")
        except Exception as e:
            print(f"\n[!] FATAL SWARM ERROR: {e}")
            traceback.print_exc() # This will print the exact line causing the issue
        finally:
            db.close()
            
        await asyncio.sleep(15) # Non-blocking sleep

@app.on_event("startup")
async def startup_event():
    print("Injecting Swarm task into async event loop...")
    asyncio.create_task(swarm_loop())

@app.get("/")
def root():
    return {"status": "IdleAxe Swarm Brain is Active"}