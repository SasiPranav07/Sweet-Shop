from pydantic import BaseModel, Field, ConfigDict

class SweetBase(BaseModel):
    name: str
    category: str
    price: float = Field(gt=0, description="Price must be greater than zero")
    quantity: int = Field(ge=0, description="Quantity cannot be negative")
    image_url: str | None = None

class SweetCreate(SweetBase):
    pass

class SweetUpdate(SweetBase):
    name: str | None = None
    category: str | None = None
    price: float | None = None
    quantity: int | None = None

class SweetRestock(BaseModel):
    quantity: int = Field(gt=0, description="Quantity to add must be positive")

class SweetResponse(SweetBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
