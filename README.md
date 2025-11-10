Personal Budget Tracker

A full-stack web application for managing personal finances with income/expense tracking, categorization, budgeting, and data visualization.

## Overview
- **Backend**: Django 4.2 + Django REST Framework with JWT authentication, filtering, and pagination
- **Frontend**: React 18 (Vite) + React Router + D3.js for interactive charts
- **Database**: SQLite (development), PostgreSQL (production)
- **Features**: User authentication, category management, transaction tracking, monthly budgets, expense visualization

## Deployment Links
- **Application Link**: https://personal-budget-tracker-xi.vercel.app 
- **Backend**: https://personal-budget-tracker-xr3r.onrender.com

## Quick Start (Local Development)
### 1. Python Environment & Dependencies
```bash
# Python 3.9+ required
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 2. Database Setup & Test User
```bash
cd backend
python manage.py migrate
python manage.py create_test_user
```

### 3. Run Backend (DRF API)
```bash
# From backend directory
python manage.py runserver
# Backend runs at http://127.0.0.1:8000/
```

### 4. Run Frontend (in a separate terminal)
```bash
cd frontend
npm install  # if not already done
npm run dev
# Frontend runs at http://localhost:5173/
```

### 5. Test the Application
- Open http://localhost:5173/ in your browser
- Login with:
  - **Username**: `testuser`
  - **Password**: `testpass123`
- Or run the automated test script: `./test_api.sh`

## Key Features

### Backend API
- **Authentication**: JWT (simplejwt) at `/api/token/` and `/api/token/refresh/`
- **Models**: Category (income/expense), Transaction, Budget
- **CRUD Operations**: Categories, Transactions, Budgets (user-scoped)
- **Filtering**: Date range, amount range, category
- **Pagination**: 10 items per page
- **Summary Endpoint**: `/api/transactions/summary/?month=YYYY-MM` returns totals and expense breakdown
- **CORS**: Enabled for local development

### Frontend Pages
- **Login**: JWT authentication with test credentials
- **Dashboard**: Monthly summary with D3.js pie chart of expenses by category
- **Transactions**: Create, list, and filter transactions
- **Categories**: Manage income and expense categories
- **Budgets**: Set and view monthly budgets

API endpoints (authenticated)
- POST /api/token/ {username, password} -> {access, refresh}
- GET/POST /api/categories/
- GET/POST /api/transactions/
  - Filters: date_from, date_to, min_amount, max_amount, category
  - Ordering: ?ordering=date or amount (prefix with - for desc)
- GET/POST /api/budgets/
- GET /api/transactions/summary/?month=YYYY-MM

Example cURL
# Obtain token
curl -X POST http://127.0.0.1:8000/api/token/ \ 
  -H 'Content-Type: application/json' \ 
  -d '{"username":"testuser","password":"testpass123"}'

# Use the printed access token
ACCESS=REPLACE_WITH_ACCESS_TOKEN

# Create categories
curl -X POST http://127.0.0.1:8000/api/categories/ \
  -H "Authorization: Bearer $ACCESS" -H 'Content-Type: application/json' \
  -d '{"name":"Salary","type":"income"}'

curl -X POST http://127.0.0.1:8000/api/categories/ \
  -H "Authorization: Bearer $ACCESS" -H 'Content-Type: application/json' \
  -d '{"name":"Groceries","type":"expense"}'

# List categories
curl -H "Authorization: Bearer $ACCESS" http://127.0.0.1:8000/api/categories/

# Add a transaction
# Find category ids from the previous list
curl -X POST http://127.0.0.1:8000/api/transactions/ \
  -H "Authorization: Bearer $ACCESS" -H 'Content-Type: application/json' \
  -d '{"date":"2025-11-08","category":CATEGORY_ID,"amount":"123.45","description":"Test"}'

# Monthly summary
curl -H "Authorization: Bearer $ACCESS" 'http://127.0.0.1:8000/api/transactions/summary/?month=2025-11'

Frontend (Vite + React)
- Modern React 18 app with Vite build tool
- React Router for navigation
- D3.js v7 for data visualization
- Pages:
  - Login: JWT authentication
  - Dashboard: Monthly summary with D3 pie chart showing expenses by category
  - Transactions: Create/list/filter transactions with date range and category filters
  - Categories: Create and manage income/expense categories
  - Budgets: Set and view monthly budgets
- Vite proxy configured to forward /api requests to Django backend (http://127.0.0.1:8000)

Notes/assumptions
- SQLite is used locally. For deployment, configure DATABASES and SECRET_KEY via env vars.
- Frontend uses localStorage to persist JWT tokens.
- CORS is enabled on backend for local development.
- For production, build frontend with `npm run build` and serve static files or deploy separately.

