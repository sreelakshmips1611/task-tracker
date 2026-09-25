# Task Tracker

A full-stack Task Tracker application built with **React** and **FastAPI**.

The application provides user authentication, task management, protected routes, and an admin dashboard for managing users and tasks.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS
- Vitest

### Backend
- FastAPI
- Python
- SQLAlchemy
- SQLite
- JWT Authentication
- Pydantic
- Pytest

## Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Protected routes
- Admin-only routes
- Authentication state management

### Task Management
- Create tasks
- View tasks
- Update task status
- Manage task details
- Task modal interface
- User task dashboard

### Admin Dashboard
- Admin dashboard
- View users
- Manage users
- View and manage tasks
- Protected admin routes

### UI
- Responsive React interface
- Sidebar navigation
- Loading states
- Toast notifications
- 404 Not Found page

##  Project Structure

```text
task-tracker/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── security.py
│   │
│   ├── tests/
│   │   ├── test_api.py
│   │   └── test_security.py
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── README.md
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
