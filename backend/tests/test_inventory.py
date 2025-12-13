import pytest
from app.models.sweet import Sweet
from app.models.user import User

@pytest.mark.asyncio
async def test_purchase_sweet(async_client):
    # Setup: Create a sweet with quantity 10
    from app.main import app
    from app.routes.sweets import get_current_admin
    # We need to use dependency override to seed data easily via the API or specific setup
    
    admin = User(email="admin@test.com", is_admin=True, id=1)
    app.dependency_overrides[get_current_admin] = lambda: admin

    # Create sweet
    create_res = await async_client.post("/api/sweets/", json={
        "name": "Lollipop", "category": "Hard Candy", "price": 0.50, "quantity": 10
    })
    sweet_id = create_res.json()["id"]
    app.dependency_overrides = {} # Reset admin override
    
    # 1. Purchase successful
    # Need to be authenticated? "Inventory (Protected)" -> assumed User login required
    # But for this test let's mock a user login
    from app.routes.sweets import get_current_user
    user = User(email="user@test.com", is_admin=False, id=2)
    app.dependency_overrides[get_current_user] = lambda: user
    
    res = await async_client.post(f"/api/sweets/{sweet_id}/purchase")
    assert res.status_code == 200
    data = res.json()
    assert data["message"] == "Purchase successful"
    assert data["remaining_quantity"] == 9
    
    # 2. Purchase out of stock
    # Exhaust stock (or update to 0)
    # Testing logic: call purchase 9 more times? Or just create a new one with 0 stock.
    
@pytest.mark.asyncio
async def test_restock_sweet_admin(async_client):
    from app.main import app
    from app.routes.sweets import get_current_admin
    
    admin = User(email="admin@test.com", is_admin=True, id=1)
    app.dependency_overrides[get_current_admin] = lambda: admin
    
    # Create sweet
    create_res = await async_client.post("/api/sweets/", json={
        "name": "Gummy Bears", "category": "Gummy", "price": 1.50, "quantity": 0
    })
    sweet_id = create_res.json()["id"]
    
    # Restock
    payload = {"quantity": 50}
    res = await async_client.post(f"/api/sweets/{sweet_id}/restock", json=payload)
    assert res.status_code == 200
    assert res.json()["quantity"] == 50
    
    app.dependency_overrides = {}
