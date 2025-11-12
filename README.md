# SmartYield - Precision Agriculture Intelligence Platform

SmartYield is a comprehensive agricultural yield prediction platform that empowers farmers, agronomists, and agricultural cooperatives with data-driven insights for better crop management decisions. The platform combines historical data, weather forecasts, and agronomic best practices to deliver accurate yield predictions and personalized farming recommendations.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication System](#authentication-system)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)

## Overview

SmartYield bridges the gap between complex agricultural data and actionable insights. By integrating multiple data sources and applying intelligent algorithms, the platform helps users:

- **Forecast crop yields** with confidence scores based on field conditions
- **Receive personalized recommendations** for irrigation, fertilization, and pest management
- **Track crop lifecycle** from sowing to harvest
- **Monitor performance** across different regions and seasons
- **Identify risks early** with AI-powered alerts

## Key Features

### 1. Yield Prediction
- Location-aware predictions using latitude/longitude or interactive map selection
- Confidence scores based on historical data and current conditions
- Baseline yield comparisons to assess performance
- Historical trend visualization with Recharts

### 2. Agronomic Advice
- Crop-specific best practices and recommendations
- Context-aware guidance based on:
  - Soil type
  - Irrigation method
  - Fertilizer usage
  - Local weather patterns
  - Sowing date

### 3. Crop Lifecycle Management
- Track milestones from planting to harvest
- Monitor growth stages
- Record observations and interventions
- Calculate days to harvest

### 4. Risk Assessment
- Early warning system for potential issues
- Weather-related risk alerts
- Soil health indicators
- Pest and disease vulnerability scores

### 5. User Authentication
- Secure user registration and login
- JWT-based authentication
- Profile management with farmer details
- Role-based access control ready

## Architecture

SmartYield follows a modern monorepo architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│   (Next.js 14 with App Router, React 18, Tailwind)     │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
                     │ (HTTP/JSON)
┌────────────────────▼────────────────────────────────────┐
│                   Backend API Layer                      │
│         (FastAPI with Pydantic validation)              │
├─────────────────────────────────────────────────────────┤
│  • Authentication (JWT)                                 │
│  • Yield Prediction                                     │
│  • Agronomic Advice                                     │
│  • Crop Lifecycle Management                            │
│  • Reference Data                                       │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐    ┌────────▼─────────┐
│  Model Inference  │    │   PostgreSQL DB   │
│  (Heuristic/ML)   │    │   (via SQLAlchemy)│
└───────────────────┘    └───────────────────┘
```

### Frontend (`apps/frontend`)
- **Framework**: Next.js 14.2.3 with App Router
- **UI Components**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Data Fetching**: SWR for caching and revalidation
- **HTTP Client**: Axios for API communication
- **Mapping**: Leaflet + React-Leaflet for location selection
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form for validation

### Backend (`services/api`)
- **Framework**: FastAPI 0.110.0
- **Data Validation**: Pydantic 2.6.0
- **Database**: SQLAlchemy 2.0.25 with Alembic migrations
- **Authentication**: 
  - Bcrypt for password hashing
  - Python-JOSE for JWT token generation
  - Email validation for user registration
- **CORS**: Configured for frontend-backend communication

### Model Inference (`services/model_inference`)
- **Current**: Heuristic-based yield estimation
- **Architecture**: Modular design for easy ML model integration
- **Inputs**: Farmer context (location, crop, soil, weather)
- **Outputs**: Yield estimates with confidence scores, historical trends, risk factors

## Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.3 | React framework with SSR/SSG |
| React | 18.3.1 | UI component library |
| TypeScript | 5.4.5 | Type-safe JavaScript |
| Tailwind CSS | 3.4.3 | Utility-first CSS framework |
| Leaflet | 1.9.4 | Interactive maps |
| Recharts | 2.8.0 | Chart library |
| SWR | 2.2.4 | Data fetching & caching |
| Axios | 1.7.2 | HTTP client |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.110.0 | Modern Python web framework |
| Uvicorn | 0.29.0 | ASGI server |
| SQLAlchemy | 2.0.25 | SQL ORM |
| Alembic | 1.13.1 | Database migrations |
| Pydantic | 2.6.0 | Data validation |
| PostgreSQL | Latest | Relational database |
| Bcrypt | 4.1.2 | Password hashing |
| Python-JOSE | 3.3.0 | JWT handling |

### Data Science & ML
| Technology | Version | Purpose |
|------------|---------|---------|
| NumPy | 2.3.3 | Numerical computing |
| PyArrow | 18.1.0 | Columnar data processing |

## Project Structure

```
smartyield/
├── apps/
│   └── frontend/                 # Next.js frontend application
│       ├── app/                  # Next.js App Router pages
│       │   ├── api/              # API proxy routes
│       │   ├── login/            # Login page
│       │   ├── register/         # Registration page
│       │   ├── profile/          # User profile
│       │   ├── predict/          # Yield prediction
│       │   ├── advice/           # Agronomic advice
│       │   └── lifecycle/        # Crop lifecycle tracking
│       ├── components/           # Reusable UI components
│       ├── lib/                  # Utility functions & contexts
│       ├── public/               # Static assets
│       └── package.json          # Frontend dependencies
│
├── services/
│   ├── api/                      # FastAPI backend
│   │   ├── alembic/              # Database migrations
│   │   │   └── versions/         # Migration files
│   │   ├── app/
│   │   │   ├── auth/             # Authentication logic
│   │   │   ├── core/             # Settings & configuration
│   │   │   ├── db/               # Database connection
│   │   │   ├── models/           # Pydantic models
│   │   │   ├── routers/          # API endpoints
│   │   │   │   ├── auth.py       # Auth endpoints
│   │   │   │   ├── predict.py    # Yield prediction
│   │   │   │   ├── advice.py     # Agronomic advice
│   │   │   │   ├── crop_lifecycle.py
│   │   │   │   └── reference.py  # Reference data
│   │   │   ├── services/         # Business logic
│   │   │   └── main.py           # FastAPI app entry
│   │   └── requirements.txt      # Python dependencies
│   │
│   └── model_inference/          # ML/Heuristic models
│       └── app/
│           └── heuristic_model.py # Yield estimation logic
│
├── data/                         # Data assets
├── docs/                         # Documentation
├── .gitignore
├── package.json                  # Root workspace config
├── pyproject.toml                # Python project config
└── README.md                     # This file
```

## Getting Started

### Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.11+
- **PostgreSQL** database (provided by Replit)

### Installation

1. **Install Frontend Dependencies**
```bash
cd apps/frontend
npm install
```

2. **Install Backend Dependencies**
```bash
# Python dependencies are managed via uv
# They will be auto-installed when you run the application
```

3. **Set Up Database**

The PostgreSQL database is automatically configured in the Replit environment. To create the necessary tables:

```bash
cd services/api
PYTHONPATH="/home/runner/workspace:${PYTHONPATH}" alembic upgrade head
```

### Environment Variables

The following environment variables are automatically configured:
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database credentials

## Running the Application

### Development Mode

The application runs both frontend and backend simultaneously using the configured workflow:

```bash
# This starts:
# 1. FastAPI backend on port 8000
# 2. Next.js frontend on port 5000
bash -c 'export ROOT_DIR=$(pwd) && cd services/api && PYTHONPATH="${ROOT_DIR}:${PYTHONPATH}" uvicorn app.main:app --host 0.0.0.0 --port 8000 & cd apps/frontend && npm run dev'
```

The application will be available at:
- **Frontend**: http://0.0.0.0:5000
- **Backend API**: http://0.0.0.0:8000
- **API Docs**: http://0.0.0.0:8000/api/docs

### Access Points

- **Homepage**: Landing page with platform overview
- **Login**: `/login` - User authentication
- **Register**: `/register` - New user registration
- **Profile**: `/profile` - User profile management
- **Predict Yield**: `/predict` - Yield prediction tool
- **Get Advice**: `/advice` - Agronomic recommendations
- **Crop Lifecycle**: `/lifecycle` - Track crop growth

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Farmer",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "securepassword",
  "confirm_password": "securepassword",
  "country": "IN",
  "state": "KA",
  "district": "BANG",
  "gender": "male",
  "date_of_birth": "1990-01-01"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=john@example.com&password=securepassword
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### Yield Prediction Endpoint

```http
POST /api/yield/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "location_name": "Bangalore",
  "crop_type": "wheat",
  "soil_type": "loamy",
  "irrigation_type": "drip",
  "acreage": 5.0,
  "rainfall": 800,
  "fertilizer_usage": 150,
  "sowing_date": "2024-06-01"
}
```

**Response**:
```json
{
  "predicted_yield": 4.5,
  "confidence": 0.85,
  "baseline_yield": 4.0,
  "historical_yields": [
    {"season": "2023-24", "yield_t_per_ha": 4.2},
    {"season": "2022-23", "yield_t_per_ha": 4.0}
  ],
  "risk_alerts": ["Low rainfall warning"],
  "recommended_practices": ["Use nitrogen fertilizer"],
  "weather_outlook": {
    "temperature": "Moderate",
    "rainfall": "Below average"
  }
}
```

### Agronomic Advice Endpoint

```http
POST /api/advice
Authorization: Bearer <token>
Content-Type: application/json

{
  "crop_type": "wheat",
  "soil_type": "loamy",
  "region": "Bangalore"
}
```

### Reference Data Endpoints

```http
GET /api/reference/crops
GET /api/reference/soil-types
GET /api/reference/irrigation-types
GET /api/reference/locations
```

### Crop Lifecycle Endpoints

```http
POST /api/crop-lifecycle
GET /api/crop-lifecycle
GET /api/crop-lifecycle/{lifecycle_id}
PUT /api/crop-lifecycle/{lifecycle_id}
DELETE /api/crop-lifecycle/{lifecycle_id}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    phone VARCHAR,
    hashed_password VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    state VARCHAR NOT NULL,
    district VARCHAR NOT NULL,
    gender VARCHAR,
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Password Resets Table
```sql
CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Running Migrations

```bash
# Create a new migration
cd services/api
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
PYTHONPATH="/home/runner/workspace:${PYTHONPATH}" alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

## Authentication System

SmartYield uses a secure JWT-based authentication system:

### Password Security
- **Hashing**: Bcrypt algorithm with automatic salting
- **Storage**: Only hashed passwords stored in database
- **Validation**: Minimum length and complexity requirements

### JWT Tokens
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: Configurable token lifetime
- **Claims**: User ID, email, and expiration time
- **Authorization**: Bearer token in HTTP headers

### Authentication Flow
1. User registers with email and password
2. Password is hashed with bcrypt
3. User credentials stored in PostgreSQL
4. Login returns JWT access token
5. Token included in subsequent API requests
6. Backend validates token and extracts user info

### Protected Routes
All prediction, advice, and lifecycle endpoints require valid JWT token:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Development Workflow

### Adding New Features

1. **Backend API Endpoint**
   - Create router in `services/api/app/routers/`
   - Define Pydantic models in `services/api/app/models/`
   - Implement business logic in `services/api/app/services/`
   - Add route to API router in `__init__.py`

2. **Frontend Page**
   - Create page in `apps/frontend/app/`
   - Build UI components in `apps/frontend/components/`
   - Use SWR for data fetching
   - Style with Tailwind CSS

3. **Database Changes**
   - Update SQLAlchemy models in `services/api/app/db/models.py`
   - Generate migration: `alembic revision --autogenerate`
   - Apply migration: `alembic upgrade head`

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **Linting**: ESLint configured for frontend
- **Formatting**: Consistent code style across project
- **Validation**: Pydantic for request/response validation

### Testing Strategy

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints with test database
- **E2E Tests**: Test complete user workflows
- **Manual Testing**: Use API docs at `/api/docs` for backend testing

## Deployment

### Production Configuration

1. **Environment Variables**
   - Set production `DATABASE_URL`
   - Configure `SECRET_KEY` for JWT
   - Set `CORS_ORIGINS` for frontend domain

2. **Database**
   - Run migrations in production
   - Set up regular backups
   - Configure connection pooling

3. **Frontend Build**
```bash
cd apps/frontend
npm run build
npm start
```

4. **Backend Deployment**
```bash
cd services/api
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Performance Optimization

- **Frontend**: 
  - Next.js static generation for landing pages
  - Image optimization with Next.js Image
  - Code splitting and lazy loading
  - SWR caching for API responses

- **Backend**:
  - Database query optimization
  - Connection pooling
  - Async/await for I/O operations
  - Response compression

### Security Considerations

- HTTPS in production
- CORS properly configured
- SQL injection prevention via ORM
- XSS protection in frontend
- Rate limiting on API endpoints
- Regular security updates

## Model Inference System

### Current Implementation: Heuristic Model

The heuristic model (`services/model_inference/app/heuristic_model.py`) uses rule-based logic:

**Inputs**:
- Location (latitude, longitude)
- Crop type
- Soil type
- Irrigation method
- Field size (acreage)
- Rainfall data
- Fertilizer usage
- Sowing date

**Processing**:
1. Calculate base yield from crop type and soil type
2. Apply modifiers based on:
   - Irrigation efficiency
   - Rainfall adequacy
   - Fertilizer application
   - Geographic factors
3. Generate confidence score
4. Create historical trend simulation
5. Identify risk factors
6. Generate recommendations

**Outputs**:
- Predicted yield (tonnes per hectare)
- Confidence score (0-1)
- Baseline yield for comparison
- Historical yield trends
- Risk alerts
- Recommended farming practices
- Weather outlook

### Future ML Integration

The architecture supports replacing the heuristic model with:
- **Random Forest** for regression
- **Neural Networks** for complex patterns
- **Ensemble Methods** for improved accuracy
- **Time Series Models** for seasonal predictions

Integration points:
- Same input/output interface
- Drop-in replacement in `YieldEngine`
- Model versioning support
- A/B testing capability

## Troubleshooting

### Common Issues

**Issue**: Database connection errors
```bash
Solution: Verify DATABASE_URL and run migrations
PYTHONPATH="/home/runner/workspace:${PYTHONPATH}" alembic upgrade head
```

**Issue**: Frontend can't reach backend
```bash
Solution: Check CORS settings and ensure both services are running
```

**Issue**: Authentication errors
```bash
Solution: Clear browser cookies and re-login
```

**Issue**: Import errors in Python
```bash
Solution: Ensure PYTHONPATH includes project root
export PYTHONPATH="/home/runner/workspace:${PYTHONPATH}"
```

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request with clear description

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- Check the documentation in `docs/` folder
- Review API documentation at `/api/docs`
- Check existing issues and discussions

## Acknowledgments

Built with modern web technologies and best practices to serve the agricultural community with reliable, data-driven insights.

---

**Version**: 0.1.0  
**Last Updated**: November 2024  
**Status**: Active Development
