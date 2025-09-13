from fastapi import FastAPI
from .database import engine, Base
from .routes import auth as auth_router, debts as debt_router

Base.metadata.create_all(bind=engine)  # dev only; use Alembic in prod

app = FastAPI(title="Debt Tracker API")
app.include_router(auth_router.router)
app.include_router(debt_router.router)
