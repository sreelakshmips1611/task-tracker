import os
os.environ["JWT_SECRET"] = "test-secret"
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_register_validation_rejects_short_password():
    response = client.post("/api/auth/register", json={"name":"Test User","email":"test-validation@example.com","password":"123"})
    assert response.status_code == 422
