import pytest
import asyncio

@pytest.mark.asyncio
async def test_register_user(async_client):
    payload = {
        "email": "test@example.com",
        "password": "strongpassword123",
        "full_name": "Test User"
    }
    response = await async_client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == payload["email"]
    assert "id" in data

@pytest.mark.asyncio
async def test_login_user(async_client):
    # First register
    payload = {
        "email": "login@example.com",
        "password": "strongpassword123",
        "full_name": "Login User"
    }
    await async_client.post("/api/auth/register", json=payload)

    # Then login
    login_payload = {
        "username": "login@example.com", # OAuth2PasswordRequestForm uses username
        "password": "strongpassword123"
    }
    # Note: OAuth2 form data usually sent as form-data, not json
    response = await async_client.post("/api/auth/login", data=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
