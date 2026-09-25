# Assignment Alignment Checklist

## Frontend assignment

- [x] React frontend
- [x] Register page
- [x] Login page
- [x] Client-side validation and error messages
- [x] JWT saved after login
- [x] Redirect after login
- [x] Logged-in user information
- [x] User task list
- [x] Admin dashboard with all users and all tasks
- [x] Create task
- [x] View tasks
- [x] Edit task
- [x] Delete task
- [x] Title, description and pending/completed status
- [x] JWT Authorization header for protected API requests
- [x] Loading states
- [x] API error display
- [x] Empty states
- [x] Logout
- [x] Responsive/mobile-friendly CSS
- [x] Environment-based API URL
- [x] No frontend credentials/secrets
- [x] 2 component tests
- [x] 1 API integration test
- [x] `src/`, `tests/`, `.env.example`, `README.md`

## Role behaviour

**Normal user**
- Sees only the tasks returned for their account by `GET /tasks`.
- Can create, view, edit and delete their own tasks.

**Admin**
- Sees all users.
- Sees all tasks.
- Can delete users, matching the companion backend assignment.
- Can edit/delete tasks exposed to the admin by the backend.

The supplied frontend assignment does not explicitly require an admin to create a task for another user, so this UI does not add an unsupported task-assignment workflow.

## Backend connection

The UI expects the API base URL from `VITE_API_URL` and sends the JWT as:

`Authorization: Bearer <token>`

Expected task endpoints are `/tasks`, `/tasks/{id}` and authentication endpoints are `/auth/register` and `/auth/login`. Admin user management uses `/users` and `/users/{id}` because the companion backend specification requires admins to view and delete users.
