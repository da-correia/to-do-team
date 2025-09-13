# app/schemas.py
from pydantic import BaseModel, EmailStr, condecimal
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    class Config:
        orm_mode = True

class PersonCreate(BaseModel):
    name: str
    contact: Optional[str] = None

class PersonRead(PersonCreate):
    id: int
    class Config:
        orm_mode = True

class DebtCreate(BaseModel):
    person_id: Optional[int]
    principal: condecimal(max_digits=12, decimal_places=2)
    currency: Optional[str] = "USD"
    description: Optional[str] = None
    due_date: Optional[datetime] = None

class DebtRead(DebtCreate):
    id: int
    is_settled: bool
    created_at: datetime
    outstanding: condecimal(max_digits=12, decimal_places=2)
    class Config:
        orm_mode = True

class PaymentCreate(BaseModel):
    amount: condecimal(max_digits=12, decimal_places=2)
    note: Optional[str] = None

class PaymentRead(PaymentCreate):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True
