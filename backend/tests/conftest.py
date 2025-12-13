import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.session import engine, init_db, get_db
from app.db.base import Base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.fixture(scope="module", autouse=True)
async def init_test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield

@pytest.fixture(scope="module")
async def async_client(init_test_db):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
