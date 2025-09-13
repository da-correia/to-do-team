# Src

All source code files should be placed in this folder. You may organize this folder as needed (e.g., `backend/`, `frontend/`, `lib/`, `source/` and or `include/` folders and so on).

> You may delete this file from your repository.

User
user_id (PK)
name
email
password
created_at
level (for gamification e.g., Bronze/Silver/Gold)

Debt
debt_id (PK)
user_id (FK → User)
debt_name (e.g., Credit Card, Loan)
balance (decimal)
interest_rate (decimal %)
minimum_payment (decimal)
created_at

RepaymentPlan 📅
plan_id (PK)
user_id (FK → User)
strategy (Snowball / Avalanche / AI Recommended)
start_date
expected_end_date
total_interest (calculated estimate)
monthly_payment (decimal)

Payment
payment_id (PK)
debt_id (FK → Debt)
plan_id (FK → RepaymentPlan)
amount (decimal)
payment_date
status (Planned / Paid / Missed)

Badge
badge_id (PK)
name (e.g., First Payment, One Debt Cleared)
description
icon_url

UserBadge
user_badge_id (PK)
user_id (FK → User)
badge_id (FK → Badge)
earned_date

