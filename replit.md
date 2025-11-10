# SmartYield - Agricultural Yield Prediction Platform

## Overview
SmartYield is a precision agriculture intelligence platform that provides yield predictions, risk assessments, and farming recommendations. The application consists of a Next.js frontend and FastAPI backend in a monorepo structure.

## Project Architecture

### Frontend (`apps/frontend`)
- **Framework**: Next.js 14.2.3 with App Router
- **UI**: React 18, Tailwind CSS
- **Key Libraries**: 
  - Leaflet for mapping
  - Recharts for data visualization
  - SWR for data fetching
  - Axios for HTTP requests

### Backend (`services/api`)
- **Framework**: FastAPI 0.110.0
- **Runtime**: Python 3.11 with Uvicorn
- **Key Libraries**:
  - Pydantic v2 for data validation
  - NumPy for computations
  - PyArrow for data processing

### Model Inference (`services/model_inference`)
- Heuristic yield prediction model
- Located in shared services directory

## Recent Changes (Vercel → Replit Migration)

### November 10, 2025
- **Port Configuration**: Updated Next.js to bind to port 5000 on 0.0.0.0
- **Webpack Configuration**: Added explicit publicPath setting to fix dynamic import chunk loading issues
- **JWT Authentication Fix**: Fixed token validation to properly handle string-to-int conversion for user IDs
- **Pydantic v2 Migration**: 
  - Updated imports from `pydantic.BaseSettings` to `pydantic_settings.BaseSettings`
  - Migrated from `conlist/conset` to `Annotated` types with `Field(min_length=...)`
  - Updated validators to use `@field_validator` decorator
- **CORS Configuration**: 
  - Removed wildcard `*` origin (incompatible with credentials)
  - Added regex pattern for Replit domains: `https://.*\.replit\.dev`
  - Maintained localhost origins for development
- **API Proxy**: Created Next.js API route at `/api/[...proxy]/route.ts` to proxy requests to backend
- **PYTHONPATH**: Configured workflow to include project root in PYTHONPATH for monorepo imports
- **YieldSummary Component**: 
  - Added defensive guards to prevent crashes with malformed data
  - Added optional chaining and fallbacks for all numeric display values
  - Verified data mapping from backend snake_case to frontend camelCase is working correctly
- **Data Flow**: 
  - Backend returns: `predicted_yield`, `baseline_yield`, `weather_outlook` (snake_case)
  - Frontend mapper converts to: `predictedYield`, `baselineYield`, `weatherOutlook` (camelCase)
  - Weather outlook nested fields use camelCase in backend: `rainfallOutlook`, `temperatureTrend`
- **Authentication System**:
  - **Database**: PostgreSQL with SQLAlchemy ORM and Alembic migrations
  - **User Model**: Stores name, email, phone, password (hashed), country, state, district, gender, DOB
  - **Security**: Bcrypt (v4.1.2) for password hashing, JWT tokens for sessions (JWT_SECRET_KEY env var)
  - **Endpoints**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/forgot-password`, `/api/auth/reset-password`
  - **Frontend Pages**: `/register`, `/login`, `/forgot-password`, `/profile` (all protected except login/register)
  - **Password Reset**: OTP-based flow (currently shows OTP in response for testing - remove in production)
  - **OAuth**: Google OAuth placeholder (integration pending)
  - **Navigation**: Simplified to 4 sections only: Home, Predict Yield, About, Profile
  - **Auth Flow**: 
    - Home page accessible to all users
    - "Launch Predict Yield" button redirects unauthenticated users to login
    - After successful login, users are redirected back to the intended page
    - Predict Yield and Profile pages are protected routes (require authentication)
  - **Auth Context**: Global authentication state managed via React Context API

## Development Setup

### Running Locally
The `dev` workflow starts both frontend and backend:
- Frontend: http://localhost:5000 (Next.js)
- Backend: http://localhost:8000 (FastAPI)

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Set to empty string to use Next.js API proxy
- `BACKEND_URL`: Backend URL for server-side proxy (defaults to http://localhost:8000)

### Dependencies
- **Frontend**: Managed via npm (see `apps/frontend/package.json`)
- **Backend**: Managed via pip (see `services/api/requirements.txt`)

## Deployment

### Production Configuration
- **Target**: Autoscale deployment
- **Build**: Installs dependencies and builds Next.js app
- **Run**: Starts both FastAPI backend (port 8000) and Next.js frontend (port 5000)

## Project Structure
```
├── apps/
│   └── frontend/          # Next.js application
│       ├── app/           # App router pages
│       ├── components/    # React components
│       └── lib/           # Utility functions
├── services/
│   ├── api/               # FastAPI backend
│   │   └── app/
│   │       ├── core/      # Configuration
│   │       ├── models/    # Pydantic models
│   │       ├── routers/   # API endpoints
│   │       └── services/  # Business logic
│   └── model_inference/   # ML model service
├── data/                  # Data files
└── docs/                  # Documentation
```

## User Preferences
- Clean, maintainable code following best practices
- Security-first approach (no hardcoded secrets, proper CORS configuration)
- Monorepo structure with clear separation of concerns
