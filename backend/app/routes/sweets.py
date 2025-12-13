from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.db.session import get_db
from app.models.sweet import Sweet
from app.models.user import User
from app.schemas.sweet import SweetCreate, SweetUpdate, SweetResponse, SweetRestock
from app.core.security import settings
# We need a dependency to get current user to check for Admin
from app.routes.auth import router as auth_router # Need to implement get_current_user there or move it to deps

# Creating simplified dependency here for now, better to move to Deps
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(current_user: User = Depends(get_current_user)):
    # Simple check, assumes is_admin column exists
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

router = APIRouter()

@router.post("/", response_model=SweetResponse, status_code=201)
async def create_sweet(sweet: SweetCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_admin)):
    new_sweet = Sweet(**sweet.model_dump())
    db.add(new_sweet)
    await db.commit()
    await db.refresh(new_sweet)
    return new_sweet

@router.get("/", response_model=List[SweetResponse])
async def read_sweets(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Sweet).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/search", response_model=List[SweetResponse])
async def search_sweets(q: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    if q:
        # Simple contains search for SQLite
        query = select(Sweet).where(Sweet.name.contains(q) | Sweet.category.contains(q))
        result = await db.execute(query)
        return result.scalars().all()
    return []

@router.delete("/{sweet_id}", status_code=204)
async def delete_sweet(sweet_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_admin)):
    result = await db.execute(select(Sweet).where(Sweet.id == sweet_id))
    sweet = result.scalars().first()
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    await db.delete(sweet)
    await db.commit()
    await db.delete(sweet)
    await db.commit()
    return None

@router.put("/{sweet_id}", response_model=SweetResponse)
async def update_sweet(sweet_id: int, sweet_in: SweetUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_admin)):
    result = await db.execute(select(Sweet).where(Sweet.id == sweet_id))
    sweet = result.scalars().first()
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    
    # Update fields
    update_data = sweet_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(sweet, key, value)
        
    db.add(sweet)
    await db.commit()
    await db.refresh(sweet)
    return sweet

@router.post("/{sweet_id}/purchase", status_code=200)
async def purchase_sweet(sweet_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Simple purchase logic without nested transaction for SQLite compatibility
    result = await db.execute(select(Sweet).where(Sweet.id == sweet_id))
    sweet = result.scalars().first()
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    if sweet.quantity < 1:
        raise HTTPException(status_code=400, detail="Out of stock")
    
    sweet.quantity -= 1
    db.add(sweet)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Transaction failed")
    
    await db.refresh(sweet)
    return {"message": "Purchase successful", "remaining_quantity": sweet.quantity}

@router.post("/{sweet_id}/restock", response_model=SweetResponse)
async def restock_sweet(sweet_id: int, restock: SweetRestock, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_admin)):
    result = await db.execute(select(Sweet).where(Sweet.id == sweet_id))
    sweet = result.scalars().first()
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")
    
    sweet.quantity += restock.quantity
    db.add(sweet)
    await db.commit()
    await db.refresh(sweet)
    return sweet
