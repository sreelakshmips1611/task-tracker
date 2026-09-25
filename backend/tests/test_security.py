from app.security import hash_password, verify_password, create_access_token, decode_access_token

def test_password_hash_is_not_plaintext():
    password = "StrongPass123"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed)

def test_wrong_password_fails():
    hashed = hash_password("StrongPass123")
    assert not verify_password("WrongPass123", hashed)

def test_jwt_contains_user_identity():
    token = create_access_token(42, "user")
    payload = decode_access_token(token)
    assert payload["sub"] == "42"
    assert payload["role"] == "user"
