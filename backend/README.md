# Task Tracker API

FastAPI + SQLAlchemy + SQLite backend for the Task Tracker application.

## Features

- JWT authentication
- Password hashing
- User and admin roles
- User registration and login
- Current user profile
- Admin user listing and deletion
- Task CRUD operations
- Users can access only their own tasks
- Admins can access all tasks
- Request validation and clear API errors
- CORS support for the Vite frontend
- SQLite database

## Project Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── security.py
├── tests/
│   ├── test_api.py
│   └── test_security.py
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
