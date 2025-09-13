from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_current_user
from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/debts", tags=["debts"])

@router.post("/", response_model=schemas.DebtRead)
def create_debt(debt_in: schemas.DebtCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    d = crud.create_debt(db, user.id, debt_in)
    # compute outstanding
    _, outstanding = crud.get_debt_with_outstanding(db, d.id)
    out_obj = schemas.DebtRead.from_orm(d)
    out_obj.outstanding = outstanding
    return out_obj

@router.post("/{debt_id}/payments", response_model=schemas.PaymentRead)
def add_payment(debt_id: int, payment_in: schemas.PaymentCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    debt = db.query(models.Debt).filter(models.Debt.id == debt_id, models.Debt.user_id == user.id).first()
    if not debt:
        raise HTTPException(404, "Debt not found")
    # Optional business rule: don't allow payment > outstanding
    _, outstanding = crud.get_debt_with_outstanding(db, debt_id)
    if payment_in.amount > outstanding:
        raise HTTPException(400, "Payment exceeds outstanding amount")
    p = crud.add_payment(db, debt_id, payment_in.amount)
    return p
