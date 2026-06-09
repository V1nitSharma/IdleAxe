# IDLE🪓AXE — Autonomous FinOps Agent Swarm

IdleAxe is an autonomous cloud optimization tool that runs a localized agent swarm to monitor infrastructure, detect idle/wasted resources, analyze engineering lifecycle context, and physically terminate inactive containers to save operational costs.

```
                  ┌──────────────┐
                  │ Telemetry    │
                  └──────┬───────┘
                         ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Audit Agent  ├─►│Context Agent ├─►│ Guard Agent  │
└──────────────┘  └──────┬───────┘  └──────┬───────┘
                         ▼                 ▼
                  ┌──────────────┐  ┌──────────────┐
                  │ Approval Q   │  │ Physical Axe │
                  └──────────────┘  └──────────────┘
```

## System Architecture

The swarm operates as a continuous loop of three specialized, cooperative agents:

1. **Audit Agent (Anomaly Detection)**
   - Scans active container telemetry (CPU and Memory).
   - Identifies candidates falling below a 5% CPU threshold and flags them.

2. **Context Agent (Risk & Decision Analysis)**
   - Sweeps flagged resources and queries engineering lifecycles.
   - Assigns a **Waste Score (0-100)** based on factors like Git commit history, branch merges, and network connections.
   - **Auto-Axe (Score ≥ 80):** High-confidence waste is marked for direct execution.
   - **HITL (Score < 80):** Ambiguous cases are routed to the human approval queue.

3. **Guard Agent (Physical Execution)**
   - Receives authorized execution commands.
   - Safely terminates physical Docker containers and updates the ledger.

---

## Repository Structure

```
IdleAxe/
├── backend/                   # Python FastAPI Control Plane
│   ├── app/
│   │   ├── api/routes.py      # Core REST Endpoints
│   │   ├── db/                # SQLAlchemy models & Postgres setup
│   │   ├── swarm/             # Agent Loop (Audit, Context, Guard)
│   │   └── main.py            # FastAPI Application Entry
│   ├── scripts/
│   │   └── simulator.py       # Docker telemetry pump & simulator
│   └── requirements.txt
│
└── frontend/                  # React + Vite Command Center
    ├── src/
    │   ├── api/               # Application Shell (App.jsx, main.jsx, client.js)
    │   ├── assets/            # CSS styles and Tailwind config
    │   └── features/          # Core Dashboard widgets
    │       ├── approval/      # Human-In-The-Loop Approval Queue
    │       ├── audit-feed/    # Scrolling Swarm Live Terminal
    │       └── dashboard/     # Stats tickers and active resources grid
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker Desktop (must be running to use the physical simulator)
- PostgreSQL database

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Setup your `.env` file with your Postgres database connection:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/idleaxe_db
   ```
5. Run the FastAPI application:
   ```bash
   uvicorn app.main:app --reload
   ```

### 2. Physical Simulator Setup
To test container detection and physical termination, run the telemetry simulator script. It spawns 10 Docker containers and pumps metrics:
```bash
python scripts/simulator.py
```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install Node modules:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **http://localhost:5173/**.

---

## Interactive Features

- **Demo Simulation Mode**: Run the swarm entirely inside the client browser. Create simulated nodes, trigger scans, and witness automated terminations without requiring active Docker/PostgreSQL servers.
- **Dynamic Sparklines**: Live telemetry tracking with SVG-based fluctuating CPU load graphs.
- **Continuous Cost Tracker**: Watch real-time financial waste gather on-screen before the swarm executes an axe action.
