import asyncio
import sys
import os

# Add current directory to path so we can import app modules
sys.path.append(os.getcwd())

from app.db.session import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import update

async def promote_all_users_to_admin():
    print("Connecting to database...")
    async with AsyncSessionLocal() as db:
        print("Promoting all users to ADMIN...")
        # Update ALL users to be admins for this demo
        await db.execute(update(User).values(is_admin=True))
        await db.commit()
        print("Success! All users are now Admins.")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(promote_all_users_to_admin())
