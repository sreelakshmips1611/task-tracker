# Task Tracker – Frontend Hiring Assignment

A polished React + Vite Task Tracker frontend built around the supplied hiring-assignment requirements.

## What is included

- React frontend with responsive UI
- Register and Login with client-side validation
- JWT session handling using `sessionStorage`
- Protected dashboard routes
- Normal-user dashboard with own tasks
- Create, view, edit and delete tasks
- Pending / completed task status
- Admin dashboard with all users and all tasks
- Admin user deletion (as required by the companion backend assignment)
- API loading, empty and error states
- Axios API client with JWT Authorization header
- Environment-based API URL
- 2 component tests + 1 API integration test
- Clean component/page/service structure

The frontend assignment explicitly requires React integration with the backend API, JWT protected routes, task CRUD, validation, loading/error/empty states, responsive UI, tests, `.env.example`, and a README. See the supplied assignment document for the official evaluation criteria.

## Project structure

```text
src/
  components/
  context/
  pages/
  services/
  utils/
tests/
.env.example
README.md
```

## Setup

```bash
npm install
```

Create `.env` from `.env.example` and set the backend URL:

```env
VITE_API_URL=http://127.0.0.1:8000/api  
```

## Run

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Test

```bash
npm test
```

## Build

```bash
npm run build
```

## Expected backend contract

Authentication:

- `POST /auth/register`
- `POST /auth/login` → should return a JWT token and user information

Tasks:

- `POST /tasks`
- `GET /tasks`
- `PUT /tasks/{id}`
- `DELETE /tasks/{id}`

Admin user management used by this UI:

- `GET /users`
- `DELETE /users/{id}`

The backend should accept `Authorization: Bearer <JWT>` on protected routes.

## Important submission note

`VITE_API_URL` is intentionally environment-based; there is no hardcoded production API URL in the application. Set it to the API supplied by the evaluator before submission.

The frontend does not contain backend secrets or credentials.
