from app import models
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_current_user
from ..database import get_db
from .. import crud, schemas
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/debts", tags=["debts"])

@router.get("", response_model=List[schemas.DebtRead])
def get_my_debts(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    debts = crud.get_debts_by_user(db, user.user_id)
    return debts

@router.post("", response_model=schemas.DebtRead)
def create_debt(debt_in: schemas.DebtCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    d = crud.create_debt(db, user.user_id, debt_in)
    # compute outstanding
    _, outstanding = crud.get_debt_with_outstanding(db, d.debt_id)
    out_obj = schemas.DebtRead.from_orm(d)
    out_obj.balance = outstanding
    return out_obj

@router.post("/{debt_id}/payments", response_model=schemas.PaymentRead)
def add_payment(
    debt_id: int,
    payment_in: schemas.PaymentCreate,
    plan_id: Optional[int] = None,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    # 1. Get the debt and verify ownership
    debt = db.query(models.Debt).filter(
        models.Debt.debt_id == debt_id,
        models.Debt.user_id == user.user_id
    ).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")

    # 2. If plan_id is provided, verify it exists and belongs to user
    plan = None
    if plan_id:
        plan = db.query(models.RepaymentPlan).filter(
            models.RepaymentPlan.plan_id == plan_id,
            models.RepaymentPlan.user_id == user.user_id
        ).first()
        if not plan:
            raise HTTPException(status_code=404, detail="Repayment plan not found")

    # 3. Create the payment
    new_payment = models.Payment(
        debt_id=debt.debt_id,
        plan_id=plan.plan_id if plan else None,
        amount=payment_in.amount,
        payment_date=payment_in.payment_date or datetime.utcnow(),
        status=payment_in.status
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    # 4. Optionally, update debt balance or status
    # You could sum payments and mark debt as settled if balance <= 0

    return new_payment
