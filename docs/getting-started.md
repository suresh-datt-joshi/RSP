# Getting Started

Follow these steps to run the SmartYield platform locally.

## Prerequisites
- Node.js 18+
- Python 3.10+
- `npm` or `pnpm`
- `pip` (or a virtual environment solution such as `venv`, `poetry`)

## Backend (FastAPI)
```bash
cd services/api
python -m venv .venv
. .venv/Scripts/activate  # Windows
pip install -r requirements.txt
uvicorn services.api.app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Explore interactive docs at `http://localhost:8000/api/docs`.

## Frontend (Next.js)
```bash
cd apps/frontend
npm install
npm run dev
```

Open `http://localhost:3000` to access the web app. If your API runs on a different host/port, set `NEXT_PUBLIC_API_BASE_URL` before starting the dev server:

```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000" npm run dev
```

## Directory Overview
- `apps/frontend`: SmartYield Next.js frontend.
- `services/api`: FastAPI backend with REST endpoints.
- `services/model_inference`: Reusable heuristic inference module (swap with ML later).
- `data/`: Synthetic remote-sensing assets and placeholders for real datasets.
- `docs/`: Architecture overview and this guide.

## Useful API Endpoints
- `GET /health` – readiness probe
- `GET /api/reference/options` – dropdown metadata
- `POST /api/yield/predict` – yield estimation
- `POST /api/advice` – agronomy guidance

## Next Steps
- Replace heuristic model with trained ML artefact placed in `services/model_inference`.
- Add persistence (PostgreSQL) for farmer profiles under `infrastructure/db`.
- Integrate real weather/market APIs and surface insights inside the frontend dashboard.

