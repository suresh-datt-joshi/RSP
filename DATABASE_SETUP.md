# Database Setup Guide for SmartYield Authentication

This guide explains how to set up the PostgreSQL database to make registration and login functionality work properly.

## Prerequisites

- PostgreSQL database must be provisioned
- Python packages must be installed (see `services/api/requirements.txt`)
- Environment variable `DATABASE_URL` must be set

## Quick Setup Steps

### 1. Create PostgreSQL Database

If the database doesn't exist, create it using the Replit database tool:
- The system will automatically set these environment variables:
  - `DATABASE_URL`
  - `PGHOST`
  - `PGPORT`
  - `PGUSER`
  - `PGPASSWORD`
  - `PGDATABASE`

### 2. Run Database Migrations

Navigate to the API directory and run migrations with proper PYTHONPATH:

```bash
export ROOT_DIR=$(pwd)
cd services/api
PYTHONPATH="${ROOT_DIR}:${PYTHONPATH}" alembic upgrade head
```

This creates the following tables:
- **users** - Stores user account information
- **password_resets** - Stores OTP tokens for password recovery
- **alembic_version** - Tracks migration history

### 3. Verify Database Tables

Check that tables were created successfully:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected output:
- `alembic_version`
- `password_resets`
- `users`

## Database Schema

### Users Table Structure

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | integer | NO | Primary key (auto-increment) |
| email | varchar | NO | User email (unique) |
| phone | varchar | YES | Phone number (unique, optional) |
| hashed_password | varchar | NO | Bcrypt-hashed password |
| is_active | boolean | YES | Account active status (default: true) |
| is_verified | boolean | YES | Email verification status (default: false) |
| created_at | timestamp | YES | Account creation timestamp |
| updated_at | timestamp | YES | Last update timestamp |
| name | varchar | NO | User's full name |
| country | varchar | NO | User's country |
| state | varchar | NO | User's state/province |
| district | varchar | NO | User's district/city |
| gender | enum | NO | Gender (male, female, other, prefer_not_to_say) |
| date_of_birth | date | NO | User's date of birth |
| google_id | varchar | YES | Google OAuth ID (unique, optional) |
| oauth_provider | varchar | YES | OAuth provider name |

### Password Resets Table Structure

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | integer | NO | Primary key (auto-increment) |
| user_id | integer | NO | Reference to user |
| email_or_phone | varchar | NO | Contact used for reset |
| otp | varchar | NO | One-time password |
| created_at | timestamp | YES | OTP creation time |
| expires_at | timestamp | NO | OTP expiration time |
| is_used | boolean | YES | Whether OTP was used (default: false) |

## Testing Authentication

### Test Registration

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "testpassword123",
    "confirm_password": "testpassword123",
    "country": "India",
    "state": "Karnataka",
    "district": "Bangalore",
    "gender": "male",
    "date_of_birth": "1990-01-01"
  }'
```

Expected response (201 Created):
```json
{
  "id": 1,
  "email": "test@example.com",
  "phone": "1234567890",
  "name": "Test User",
  "country": "India",
  "state": "Karnataka",
  "district": "Bangalore",
  "gender": "male",
  "date_of_birth": "1990-01-01",
  "is_active": true,
  "is_verified": false
}
```

### Test Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email_or_phone": "test@example.com",
    "password": "testpassword123"
  }'
```

Expected response (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Test Authentication

```bash
TOKEN="<your_token_here>"
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

Expected response (200 OK):
```json
{
  "id": 1,
  "email": "test@example.com",
  "name": "Test User",
  ...
}
```

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'services'"

**Solution:** Run migrations with PYTHONPATH set:
```bash
export ROOT_DIR=$(pwd)
cd services/api
PYTHONPATH="${ROOT_DIR}:${PYTHONPATH}" alembic upgrade head
```

### Issue: "DATABASE_URL environment variable is not set"

**Solution:** Create the PostgreSQL database using Replit's database tool. The environment variable will be set automatically.

### Issue: "Failed to register" in frontend

**Possible causes:**
1. Database doesn't exist → Create PostgreSQL database
2. Tables not created → Run Alembic migrations
3. Backend not running → Check workflow logs
4. Port mismatch → Verify backend on port 8000, frontend on port 5000

### Issue: Migration fails with import errors

**Solution:** Ensure all Python dependencies are installed:
```bash
cd services/api
pip install -r requirements.txt
```

## Environment Configuration

### Backend Configuration
The backend (`services/api/app/db/database.py`) reads the database URL from:
```python
DATABASE_URL = os.getenv("DATABASE_URL")
```

### Alembic Configuration
The migration tool (`services/api/alembic/env.py`) also uses the same environment variable:
```python
database_url = os.getenv("DATABASE_URL")
if database_url:
    config.set_main_option("sqlalchemy.url", database_url)
```

## Security Notes

- Passwords are hashed using **bcrypt** before storage
- JWT tokens use HS256 algorithm with a secret key
- Default JWT expiration: 30 minutes
- Set `JWT_SECRET_KEY` environment variable in production (defaults to dev key)

## Migration Files

Current migrations in `services/api/alembic/versions/`:
- `342bea4cc1c0_initial_migration_add_users_and_.py` - Creates users and password_resets tables

## Verification Checklist

- [ ] PostgreSQL database created
- [ ] DATABASE_URL environment variable set
- [ ] Python dependencies installed
- [ ] Alembic migrations run successfully
- [ ] Tables exist in database (users, password_resets)
- [ ] Registration endpoint returns 201 status
- [ ] Login endpoint returns JWT token
- [ ] /api/auth/me validates tokens correctly
- [ ] Frontend can register users through /api proxy
- [ ] Frontend can login users through /api proxy

## Additional Resources

- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:5000`
- API Documentation: `http://localhost:8000/docs`
- Migration config: `services/api/alembic.ini`
- Database models: `services/api/app/db/models.py`
- Auth routes: `services/api/app/routers/auth.py`
