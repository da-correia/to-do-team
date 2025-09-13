from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from enum import Enum

# Enum definitions
class StrategyEnum(str, Enum):
    snowball = "Snowball"
    avalanche = "Avalanche"
    ai_recommended = "AI Recommended"

class PaymentStatusEnum(str, Enum):
    planned = "Planned"
    paid = "Paid"
    missed = "Missed"

# -------------------
# User Schemas
# -------------------

class Token(BaseModel):
    access_token: str
    token_type: str

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    user_id: int
    created_at: datetime
    level: str

    class Config:
        from_attributes = True

# -------------------
# Debt Schemas
# -------------------
class DebtCreate(BaseModel):
    debt_name: str
    balance: float
    interest_rate: float
    minimum_payment: float

class DebtRead(DebtCreate):
    debt_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# -------------------
# RepaymentPlan Schemas
# -------------------
class RepaymentPlanBase(BaseModel):
    strategy: StrategyEnum
    start_date: Optional[datetime] = None
    expected_end_date: Optional[datetime] = None
    total_interest: Optional[float] = None
    monthly_payment: float

class RepaymentPlanCreate(RepaymentPlanBase):
    pass

class RepaymentPlanOut(RepaymentPlanBase):
    plan_id: int
    user_id: int

    class Config:
        from_attributes = True

# -------------------
# Payment Schemas
# -------------------
class PaymentBase(BaseModel):
    amount: float
    payment_date: Optional[datetime] = None
    status: Optional[PaymentStatusEnum] = PaymentStatusEnum.planned

class PaymentCreate(PaymentBase):
    status: Optional[str] = "Planned"
    note: Optional[str] = None

class PaymentRead(PaymentBase):
    payment_id: int
    debt_id: int
    plan_id: Optional[int]

    class Config:
        from_attributes = True

# -------------------
# Badge Schemas
# -------------------
class BadgeBase(BaseModel):
    name: str
    description: Optional[str]
    icon_url: Optional[str]

class BadgeCreate(BadgeBase):
    pass

class BadgeOut(BadgeBase):
    badge_id: int

    class Config:
        from_attributes = True

# -------------------
# UserBadge Schemas
# -------------------
class UserBadgeBase(BaseModel):
    earned_date: Optional[datetime] = None

class UserBadgeCreate(UserBadgeBase):
    user_id: int
    badge_id: int

class UserBadgeOut(UserBadgeBase):
    user_badge_id: int
    user_id: int
    badge_id: int

    class Config:
        from_attributes = True
