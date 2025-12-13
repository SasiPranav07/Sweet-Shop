import asyncio
import sys
import os

sys.path.append(os.getcwd())

from app.db.session import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select

async def list_users():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User))
        users = result.scalars().all()
        print("Registered Users:")
        for u in users:
            print(f"- Email: {u.email}, ID: {u.id}, IsAdmin: {u.is_admin}")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(list_users())
