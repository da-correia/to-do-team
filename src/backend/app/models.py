from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Text
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    people = relationship("Person", back_populates="user", cascade="all,delete")
    debts = relationship("Debt", back_populates="user", cascade="all,delete")

class Person(Base):
    __tablename__ = "people"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String, index=True, nullable=False)
    contact = Column(String, nullable=True)
    user = relationship("User", back_populates="people")
    debts = relationship("Debt", back_populates="person", cascade="all,delete")

class Debt(Base):
    __tablename__ = "debts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    person_id = Column(Integer, ForeignKey("people.id"), nullable=True)  # optional contact
    principal = Column(Numeric(12,2), nullable=False)
    currency = Column(String(3), default="USD")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    is_settled = Column(Boolean, default=False)

    user = relationship("User", back_populates="debts")
    person = relationship("Person", back_populates="debts")
    payments = relationship("Payment", back_populates="debt", cascade="all,delete")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    debt_id = Column(Integer, ForeignKey("debts.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(12,2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    note = Column(Text, nullable=True)

    debt = relationship("Debt", back_populates="payments")
