# SmartYield Platform Architecture

## Overview
SmartYield helps farmers forecast crop yield and discover actionable guidance tailored to their location and field conditions. The solution is split into a **Next.js** frontend and a **FastAPI** backend with a modular ML inference layer that can evolve over time.

## High-Level Components
- **Frontend (`apps/frontend`)**
  - Next.js App Router UI with client/server components.
  - Supports location selection (map or dropdown fallback), parameter capture, and rich insight presentation.
  - Uses `SWR` for data fetching and caching, `react-leaflet` for map-based location selection, and Tailwind CSS for styling.
  - Communicates with backend via REST (`/api/yield/predict`, `/api/reference/options`, `/api/advice`).
- **Backend API (`services/api`)**
  - FastAPI service exposing REST endpoints for prediction, agronomic advice, and reference data.
  - Encapsulates business rules, validation, and response shaping.
  - Delegates yield estimation logic to the model service (or an in-process stub during early phases).
- **Model Inference (`services/model_inference`)**
  - Python module responsible for transforming raw input into yield estimates.
  - Initially hosts a heuristic model that mimics agronomic reasoning (rainfall, soil, crop coefficients, etc.).
  - Designed to be replaced by an ML pipeline fed by datasets in `data/`.
- **Data Assets (`data/`)**
  - Synthetic remote sensing assets prepared for experimentation.
  - Future ingestion pipelines live under `pipelines/data_ingest`.

## Data Flow
1. Farmer provides location & field parameters in the UI.
2. Frontend calls the backend prediction endpoint.
3. Backend validates input, enriches it (e.g., fetches normative benchmarks), and calls the model layer.
4. Model returns yield estimate plus context (confidence interval, historical baseline).
5. Backend composes response with agronomic recommendations and sends to frontend.
6. Frontend renders forecast, charts, and actionable insights.

## Key Features
- Yield prediction with confidence score and trend context.
- Location-aware recommendations (irrigation, fertilizer schedule, soil health).
- Weather outlook stub paving the way for integration with external APIs.
- Knowledge base cards highlighting crop-specific best practices.

## Extensibility Notes
- Add authentication (e.g., farmers logging in) via NextAuth or custom provider.
- Replace heuristic model with trained ML artifact accessible through the `model_inference` module or a microservice.
- Integrate weather APIs and satellite data to refine predictions.
- Persist farmer profiles and field history using PostgreSQL (see `infrastructure/db`).

