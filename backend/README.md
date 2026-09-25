# Task Tracker API

FastAPI + SQLAlchemy + SQLite backend for the Task Tracker frontend assignment.

## Features
- JWT authentication
- Password hashing
- User/admin roles
- User registration and login
- Current user profile
- Admin user listing/deletion
- Task CRUD
- Users can access only their own tasks
- Admins can access all tasks
- Validation and clear API errors
- CORS for the Vite frontend

## Setup

1. Create a virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and change `JWT_SECRET` for a real submission.

4. Run:

```bash
uvicorn app.main:app --reload --port 5000
```

API base URL: `http://localhost:5000/api`

Health check: `http://localhost:5000/api/health`

## Frontend

Set the React project's `.env` to:

```env
VITE_API_URL=http://localhost:5000/api
```

Restart Vite after changing `.env`.

## Tests

```bash
pytest -q
```

## Main endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users` (admin)
- `DELETE /api/users/{id}` (admin)
- `POST /api/tasks`
- `GET /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
