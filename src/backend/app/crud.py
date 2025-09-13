from sqlalchemy.orm import Session
from . import models, schemas
from decimal import Decimal
from sqlalchemy import func

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, name: str, email: str, password_hashed: str):
    user = models.User(name=name, email=email, password=password_hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_person(db: Session, user_id: int, name: str, contact: str | None):
    p = models.Person(user_id=user_id, name=name, contact=contact)
    db.add(p); db.commit(); db.refresh(p); return p

def create_debt(db: Session, user_id: int, debt_in: schemas.DebtCreate):
    d = models.Debt(user_id=user_id,
                    person_id=debt_in.person_id,
                    principal=debt_in.principal,
                    currency=debt_in.currency,
                    description=debt_in.description,
                    due_date=debt_in.due_date)
    db.add(d); db.commit(); db.refresh(d); return d

def get_debt_with_outstanding(db: Session, debt_id: int):
    debt = db.query(models.Debt).filter(models.Debt.id == debt_id).first()
    if not debt: return None
    paid = db.query(func.coalesce(func.sum(models.Payment.amount), 0)).filter(models.Payment.debt_id == debt.id).scalar()
    outstanding = Decimal(debt.principal) - Decimal(paid)
    return debt, outstanding

def add_payment(db: Session, debt_id: int, amount):
    payment = models.Payment(debt_id=debt_id, amount=amount)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    # Optionally, mark debt settled if outstanding <= 0
    debt = db.query(models.Debt).filter(models.Debt.id == debt_id).first()
    paid = db.query(func.coalesce(func.sum(models.Payment.amount), 0)).filter(models.Payment.debt_id == debt.id).scalar()
    from decimal import Decimal
    if Decimal(debt.principal) - Decimal(paid) <= 0:
        debt.is_settled = True
        db.add(debt); db.commit()
    return payment
