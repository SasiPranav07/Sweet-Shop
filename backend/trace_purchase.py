import asyncio
import httpx
import sys

# Define base URL
BASE_URL = "http://localhost:8000/api"

async def debug_purchase():
    async with httpx.AsyncClient() as client:
        # 1. Login to get token
        print("Logging in...")
        # Assuming we have the user from before. I'll use a hardcoded one or the one we just promoted.
        # Actually I need a valid user. I'll try to register a temp one to be sure.
        email = "debug_user@test.com"
        password = "password123"
        
        try:
            reg_res = await client.post(f"{BASE_URL}/auth/register", json={
                "email": email,
                "password": password,
                "full_name": "Debug User"
            })
            print(f"Register status: {reg_res.status_code}")
        except:
            pass # Maybe already exists

        # Login
        data = {"username": email, "password": password}
        login_res = await client.post(f"{BASE_URL}/auth/login", data=data)
        if login_res.status_code != 200:
            print(f"Login failed: {login_res.text}")
            return
        
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("Logged in successfully.")

        # 2. Get a sweet ID
        sweets_res = await client.get(f"{BASE_URL}/sweets/", headers=headers)
        if sweets_res.status_code != 200:
            print(f"Failed to fetch sweets: {sweets_res.text}")
            return
        
        sweets = sweets_res.json()
        if not sweets:
            print("No sweets found to purchase.")
            return
        
        target_sweet = sweets[0]
        print(f"Attempting to purchase sweet: {target_sweet['name']} (ID: {target_sweet['id']})")

        # 3. Attempt Purchase
        purchase_res = await client.post(f"{BASE_URL}/sweets/{target_sweet['id']}/purchase", headers=headers)
        print(f"\nPurchase Response Code: {purchase_res.status_code}")
        print(f"Purchase Response Body: {purchase_res.text}")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(debug_purchase())
