import pytest
from app.core.security import create_access_token
from app.models.user import User
from sqlalchemy.future import select

@pytest.fixture
async def admin_token(async_client):
    # Register an admin user
    payload = {
        "email": "admin@sweets.com",
        "password": "adminpass",
        "full_name": "Admin User"
    }
    # Register (this creates a standard user)
    await async_client.post("/api/auth/register", json=payload)
    
    # Login to get token
    login_payload = {"username": "admin@sweets.com", "password": "adminpass"}
    response = await async_client.post("/api/auth/login", data=login_payload)
    token = response.json()["access_token"]
    
    # We need to manually promote this user to admin in the DB because register doesn't allow it
    # AND our dependency checks for is_admin.
    # Since we can't easily access the session used by the app created in the fixture without complex wiring,
    # we might need to rely on the fact that the TEST DB is shared if configured right?
    # BUT, we are using an in-memory or local file DB in the app.
    # The simplest way without direct DB access is to MOCK the dependency `get_current_admin`.
    # OR, we update the logic.
    # Let's try to mock the dependency override in the test!
    return token

@pytest.mark.asyncio
async def test_create_sweet(async_client):
    # Override dependency to simulate admin
    from app.main import app
    from app.routes.sweets import get_current_admin
    from app.models.user import User
    
    # Create the user object we want the dep to return
    mock_admin = User(email="admin@test.com", is_admin=True, id=1)
    
    async def mock_get_current_admin():
        return mock_admin
    
    app.dependency_overrides[get_current_admin] = mock_get_current_admin
    
    payload = {
        "name": "Chocolate Fudge",
        "category": "Fudge",
        "price": 5.50,
        "quantity": 100
    }
    
    try:
        response = await async_client.post("/api/sweets/", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Chocolate Fudge"
        assert int(data["id"]) > 0
    finally:
        app.dependency_overrides = {}

@pytest.mark.asyncio
async def test_read_sweets(async_client):
    # Create a sweet first
    from app.main import app
    from app.routes.sweets import get_current_admin
    from app.models.user import User
    
    mock_admin = User(email="admin@test.com", is_admin=True, id=1)
    async def mock_get_current_admin():
        return mock_admin
    app.dependency_overrides[get_current_admin] = mock_get_current_admin
    
    await async_client.post("/api/sweets/", json={
        "name": "Vanilla Bean", "category": "Ice Cream", "price": 3.0, "quantity": 50
    })
    app.dependency_overrides = {}

    response = await async_client.get("/api/sweets/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(s["name"] == "Vanilla Bean" for s in data)

@pytest.mark.asyncio
async def test_search_sweets(async_client):
    # Assumes previous test ran or DB persists in module (it does based on fixture scope)
    # Search for 'Bean'
    response = await async_client.get("/api/sweets/search?q=Bean")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Vanilla Bean"
