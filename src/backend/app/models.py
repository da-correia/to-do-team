from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric, Enum
from sqlalchemy.orm import relationship, declarative_base
from .database import Base
from datetime import datetime
import enum

# Enum for repayment plan strategy
class StrategyEnum(str, enum.Enum):
    snowball = "Snowball"
    avalanche = "Avalanche"
    ai_recommended = "AI Recommended"

# Enum for payment status
class PaymentStatusEnum(str, enum.Enum):
    planned = "Planned"
    paid = "Paid"
    missed = "Missed"

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    level = Column(String, default="Bronze")

    debts = relationship("Debt", back_populates="user")
    repayment_plans = relationship("RepaymentPlan", back_populates="user")
    user_badges = relationship("UserBadge", back_populates="user")

class Debt(Base):
    __tablename__ = "debts"

    debt_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    debt_name = Column(String, nullable=False)
    balance = Column(Numeric(12,2), nullable=False)
    interest_rate = Column(Numeric(5,2), nullable=False)
    minimum_payment = Column(Numeric(12,2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="debts")
    payments = relationship("Payment", back_populates="debt")

class RepaymentPlan(Base):
    __tablename__ = "repayment_plans"

    plan_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    strategy = Column(Enum(StrategyEnum), nullable=False)
    start_date = Column(DateTime, default=datetime.utcnow)
    expected_end_date = Column(DateTime)
    total_interest = Column(Numeric(12,2))
    monthly_payment = Column(Numeric(12,2))

    user = relationship("User", back_populates="repayment_plans")
    payments = relationship("Payment", back_populates="plan")

class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, index=True)
    debt_id = Column(Integer, ForeignKey("debts.debt_id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("repayment_plans.plan_id"), nullable=True)
    amount = Column(Numeric(12,2), nullable=False)
    payment_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(PaymentStatusEnum), default=PaymentStatusEnum.planned)

    debt = relationship("Debt", back_populates="payments")
    plan = relationship("RepaymentPlan", back_populates="payments")

class Badge(Base):
    __tablename__ = "badges"

    badge_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    icon_url = Column(String)

    user_badges = relationship("UserBadge", back_populates="badge")

class UserBadge(Base):
    __tablename__ = "user_badges"

    user_badge_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.badge_id"), nullable=False)
    earned_date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_badges")
    badge = relationship("Badge", back_populates="user_badges")
