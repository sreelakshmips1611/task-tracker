import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from .database import Base, engine, get_db
from .models import User, Task
from .schemas import RegisterRequest, LoginRequest, AuthResponse, UserOut, TaskCreate, TaskUpdate, TaskOut
from .security import hash_password, verify_password, create_access_token
from .dependencies import get_current_user, require_admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        admin_email = os.getenv("ADMIN_EMAIL", "").strip().lower()
        admin_password = os.getenv("ADMIN_PASSWORD", "")
        admin_name = os.getenv("ADMIN_NAME", "Administrator")
        if admin_email and admin_password and not db.query(User).filter(User.email == admin_email).first():
            db.add(User(name=admin_name, email=admin_email, password_hash=hash_password(admin_password), role="admin"))
            db.commit()
    finally:
        db.close()
    yield

app = FastAPI(title="Task Tracker API", version="1.0.0", lifespan=lifespan)

origins = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(",") if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Task Tracker API"}

@app.post("/api/auth/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = User(name=payload.name.strip(), email=email, password_hash=hash_password(payload.password), role="user")
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(user.id, user.role)
    return AuthResponse(access_token=token, user=user)

@app.post("/api/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user.id, user.role)
    return AuthResponse(access_token=token, user=user)

@app.get("/api/auth/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/api/users", response_model=list[UserOut])
def list_users(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.scalars(select(User).order_by(User.created_at.desc())).all()

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own admin account")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.post("/api/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = Task(title=payload.title.strip(), description=payload.description, status=payload.status, user_id=current_user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@app.get("/api/tasks", response_model=list[TaskOut])
def list_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = select(Task).order_by(Task.created_at.desc())
    if current_user.role != "admin":
        query = query.where(Task.user_id == current_user.id)
    return db.scalars(query).all()

@app.put("/api/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, payload: TaskUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if current_user.role != "admin" and task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only modify your own tasks")
    task.title = payload.title.strip()
    task.description = payload.description
    task.status = payload.status
    db.commit()
    db.refresh(task)
    return task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if current_user.role != "admin" and task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own tasks")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
