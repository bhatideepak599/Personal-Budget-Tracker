# Personal Budget Tracker - Developer Guide

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Flow](#architecture--flow)
4. [Project Structure](#project-structure)
5. [Backend (Django)](#backend-django)
6. [Frontend (React)](#frontend-react)
7. [API Documentation](#api-documentation)
8. [Authentication Flow](#authentication-flow)
9. [Key Features Implementation](#key-features-implementation)
10. [Development Workflow](#development-workflow)

---

## 🎯 Project Overview

This is a full-stack personal budget tracking application that allows users to:
- Track income and expenses
- Categorize transactions
- Set monthly budgets
- View spending analytics with D3.js charts
- Filter and search transactions
- Compare budget vs actual expenses

---

## 🛠 Technology Stack

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework (DRF)** - RESTful API toolkit
- **djangorestframework-simplejwt** - JWT authentication
- **django-filter** - Advanced filtering
- **django-cors-headers** - CORS support
- **SQLite** - Database (default, can be changed to PostgreSQL)

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **D3.js** - Data visualization
- **React Toastify** - Toast notifications
- **Vite** - Build tool and dev server

---

## 🏗 Architecture & Flow

### High-Level Architecture

```
┌─────────────────┐         HTTP/JSON          ┌─────────────────┐
│                 │ ◄────────────────────────► │                 │
│  React Frontend │    JWT Authentication      │  Django Backend │
│   (Port 5173)   │                            │   (Port 8000)   │
│                 │                            │                 │
└─────────────────┘                            └─────────────────┘
        │                                              │
        │                                              │
        ▼                                              ▼
  localStorage                                    SQLite DB
  (JWT tokens)                                  (User data)
```

### Request Flow

1. **User Login**:
   ```
   User → Login Form → POST /api/token/ → Django validates → Returns JWT tokens
   → Frontend stores in localStorage → Redirects to Dashboard
   ```

2. **Authenticated Request**:
   ```
   User Action → React Component → API call with JWT in header
   → Django validates token → Processes request → Returns JSON
   → React updates UI
   ```

3. **Token Refresh**:
   ```
   API call fails (401) → Auto refresh token → POST /api/token/refresh/
   → Get new access token → Retry original request
   ```

---

## 📁 Project Structure

```
personal-budget-tracker/
├── backend/                    # Django backend
│   ├── budget_backend/         # Main Django project
│   │   ├── settings.py         # Django settings (DB, JWT, CORS)
│   │   ├── urls.py             # Root URL configuration
│   │   └── wsgi.py             # WSGI application
│   ├── finance/                # Main Django app
│   │   ├── models.py           # Database models (Category, Transaction, Budget)
│   │   ├── serializers.py      # DRF serializers (JSON conversion)
│   │   ├── views.py            # API ViewSets (business logic)
│   │   ├── filters.py          # Custom filters for transactions
│   │   ├── urls.py             # App URL routing
│   │   └── migrations/         # Database migrations
│   ├── manage.py               # Django management script
│   └── db.sqlite3              # SQLite database
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── api/                # API client
│   │   │   └── index.js        # Axios-like fetch wrapper with JWT
│   │   ├── components/         # Reusable components
│   │   │   ├── common/         # Generic UI components
│   │   │   │   ├── Button/
│   │   │   │   ├── Card/
│   │   │   │   ├── Input/
│   │   │   │   ├── Select/
│   │   │   │   ├── Alert/
│   │   │   │   └── Table/
│   │   │   └── layout/         # Layout components
│   │   │       ├── Layout/     # Main app layout
│   │   │       ├── Navbar/     # Navigation bar
│   │   │       └── PageHeader/ # Page title header
│   │   ├── pages/              # Page components
│   │   │   ├── Login/          # Login page
│   │   │   ├── Dashboard/      # Dashboard with charts
│   │   │   ├── Transactions/   # Transaction management
│   │   │   ├── Categories/     # Category management
│   │   │   └── Budgets/        # Budget management
│   │   ├── styles/             # Global styles
│   │   ├── App.jsx             # Root component with routing
│   │   └── main.jsx            # React entry point
│   ├── package.json            # NPM dependencies
│   └── vite.config.js          # Vite configuration
│
├── README.md                   # User documentation
├── DEVELOPER_GUIDE.md          # This file
└── PROJECT_SUMMARY.md          # Project summary
```

---

## 🐍 Backend (Django)

### Database Models

#### 1. Category Model (`finance/models.py`)
```python
class Category(models.Model):
    user = ForeignKey(User)           # Owner of category
    name = CharField(max_length=100)  # Category name
    type = CharField                  # 'income' or 'expense'
    created_at = DateTimeField
```

#### 2. Budget Model
```python
class Budget(models.Model):
    user = ForeignKey(User)           # Owner of budget
    year = IntegerField               # Budget year
    month = IntegerField              # Budget month (1-12)
    amount = DecimalField             # Budget amount
    created_at = DateTimeField
```

#### 3. Transaction Model
```python
class Transaction(models.Model):
    user = ForeignKey(User)           # Owner of transaction
    category = ForeignKey(Category)   # Transaction category
    amount = DecimalField             # Transaction amount
    date = DateField                  # Transaction date
    description = TextField           # Optional description
    created_at = DateTimeField
```

### ViewSets (API Endpoints)

Django REST Framework uses **ViewSets** to automatically create CRUD endpoints:

```python
# finance/views.py
class CategoryViewSet(BaseOwnedViewSet):
    # Automatically creates:
    # GET    /api/categories/       - List all
    # POST   /api/categories/       - Create new
    # GET    /api/categories/{id}/  - Get one
    # PUT    /api/categories/{id}/  - Update
    # DELETE /api/categories/{id}/  - Delete
```

### Custom Endpoints

```python
@decorators.action(detail=False, methods=["get"], url_path="summary")
def summary(self, request):
    # Custom endpoint: GET /api/transactions/summary/
    # Returns monthly income, expenses, and breakdown
```

### Authentication

**JWT (JSON Web Tokens)** with `djangorestframework-simplejwt`:

```python
# settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),   # Token valid for 24 hours
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),    # Refresh valid for 7 days
    'ROTATE_REFRESH_TOKENS': True,                  # New refresh on each use
}
```

### Filtering

Uses `django-filter` for advanced filtering:

```python
# finance/filters.py
class TransactionFilter(filters.FilterSet):
    date_from = filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to = filters.DateFilter(field_name='date', lookup_expr='lte')
    min_amount = filters.NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = filters.NumberFilter(field_name='amount', lookup_expr='lte')
```

Usage: `/api/transactions/?date_from=2025-01-01&min_amount=100`

---

## ⚛️ Frontend (React)

### Component Architecture

```
App (Router)
├── Login Page
└── Layout (Navbar + Outlet)
    ├── Dashboard
    ├── Transactions
    ├── Categories
    └── Budgets
```

### State Management

Uses **React Hooks** for state management:

```javascript
const [data, setData] = useState([]);           // Component state
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');

useEffect(() => {
  loadData();  // Load on mount
}, []);

const loadData = useCallback(async () => {
  // Fetch data from API
}, [dependencies]);
```

### API Client (`frontend/src/api/index.js`)

Custom fetch wrapper with JWT authentication:

```javascript
async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,  // Add JWT token
  };

  let response = await fetch(`/api${endpoint}`, { ...options, headers });

  // Auto-refresh token on 401
  if (response.status === 401 && refreshToken) {
    const newToken = await refreshAccessToken();
    // Retry request with new token
  }

  return response.json();
}
```

### Routing

```javascript
// App.jsx
<Routes>
  <Route path="/" element={<Login />} />
  <Route element={<Layout />}>  {/* Protected routes */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/transactions" element={<Transactions />} />
    <Route path="/categories" element={<Categories />} />
    <Route path="/budgets" element={<Budgets />} />
  </Route>
</Routes>
```

### D3.js Charts

**Pie Chart** (Expenses by Category):
```javascript
const svg = d3.select(svgRef.current);
const pie = d3.pie().value(d => d.total);
const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
// Draw slices with data
```

**Bar Chart** (Budget vs Actual):
```javascript
const x = d3.scaleBand().domain(['Budget', 'Actual']);
const y = d3.scaleLinear().domain([0, maxValue]);
// Draw bars with scales
```

---




## 🔐 Authentication Flow

### 1. Login Process

```
┌──────────┐                                    ┌──────────┐
│  User    │                                    │  Django  │
└────┬─────┘                                    └────┬─────┘
     │                                               │
     │  1. Enter username/password                   │
     ├──────────────────────────────────────────────►│
     │  POST /api/token/                             │
     │  { username, password }                       │
     │                                               │
     │  2. Validate credentials                      │
     │                                               │
     │  3. Return JWT tokens                         │
     │◄──────────────────────────────────────────────┤
     │  { access: "...", refresh: "..." }            │
     │                                               │
     │  4. Store tokens in localStorage              │
     │                                               │
     │  5. Redirect to /dashboard                    │
     │                                               │
```

**Code Flow**:
```javascript
// 1. User submits login form
const handleSubmit = async (e) => {
  const data = await api.login(username, password);

  // 2. Store tokens
  setToken(data.access, data.refresh);

  // 3. Navigate to dashboard
  navigate('/dashboard');
};
```

### 2. Authenticated Request

```javascript
// Every API request includes JWT token
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};

// Django validates token
# views.py
class BaseOwnedViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]  # Requires valid JWT
```

### 3. Token Refresh

```javascript
// When access token expires (401 error)
if (response.status === 401 && refreshToken) {
  // 1. Call refresh endpoint
  const newToken = await refreshAccessToken();

  // 2. Update stored token
  setToken(newToken);

  // 3. Retry original request
  response = await fetch(originalRequest);
}
```

---

## 🎨 Key Features Implementation

### 1. Transaction Management

**Features**:
- ✅ Create, Read, Update, Delete transactions
- ✅ Filter by date range, category, amount
- ✅ Pagination (5, 10, 25, 50 items per page)
- ✅ Inline editing

**Code Example**:
```javascript
// Transactions.jsx
const handleEdit = (transaction) => {
  setForm({
    date: transaction.date,
    category: transaction.category,
    amount: transaction.amount,
    description: transaction.description
  });
  setEditingId(transaction.id);
};

const handleSubmit = async (e) => {
  if (editingId) {
    await api.updateTransaction(editingId, form);
    toast.success('Transaction updated!');
  } else {
    await api.createTransaction(form);
    toast.success('Transaction created!');
  }
};
```

### 2. Budget vs Actual Comparison

**Features**:
- ✅ Set monthly budgets
- ✅ Compare budget to actual expenses
- ✅ D3.js bar chart visualization
- ✅ Color-coded status (green = under budget, red = over budget)

**Code Example**:
```javascript
// Dashboard.jsx
const loadBudget = async () => {
  const [year, month] = currentMonth.split('-');
  const budgets = await api.getBudgets({ year, month });
  setBudget(budgets[0]);
};

// D3.js chart
const data = [
  { label: 'Budget', value: budgetAmount, color: '#3b82f6' },
  { label: 'Actual', value: actualExpenses, color: actualExpenses > budgetAmount ? '#ef4444' : '#10b981' }
];
```

### 3. Category-based Expense Tracking

**Features**:
- ✅ Create income/expense categories
- ✅ Pie chart showing expense breakdown
- ✅ Category filtering

**Code Example**:
```javascript
// D3.js Pie Chart
const pie = d3.pie().value(d => d.total);
const arc = d3.arc()
  .innerRadius(radius * 0.5)
  .outerRadius(radius);

arcs.append('path')
  .attr('d', arc)
  .attr('fill', (_, i) => color(i));
```

### 4. Toast Notifications

**Features**:
- ✅ Success/error notifications
- ✅ Auto-dismiss after 3 seconds
- ✅ Replaces window.alert and window.confirm

**Code Example**:
```javascript
import { toast } from 'react-toastify';

// Success
toast.success('Transaction created successfully!');

// Error
toast.error('Failed to save transaction');

// Warning
toast.warning('Budget exceeded!');
```

---

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/token/
**Login and get JWT tokens**

Request:
```json
{
  "username": "testuser",
  "password": "testpass123"
}
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### POST /api/token/refresh/
**Refresh access token**

Request:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."  // New refresh token
}
```

### Category Endpoints

#### GET /api/categories/
**List all categories**

Query Parameters:
- `type` (optional): Filter by 'income' or 'expense'

Response:
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "name": "Salary",
      "type": "income",
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

#### POST /api/categories/
**Create a new category**

Request:
```json
{
  "name": "Groceries",
  "type": "expense"
}
```

Response:
```json
{
  "id": 2,
  "name": "Groceries",
  "type": "expense",
  "created_at": "2025-01-15T14:30:00Z"
}
```

### Transaction Endpoints

#### GET /api/transactions/
**List all transactions**

Query Parameters:
- `date_from`: Filter from date (YYYY-MM-DD)
- `date_to`: Filter to date (YYYY-MM-DD)
- `min_amount`: Minimum amount
- `max_amount`: Maximum amount
- `category`: Category ID
- `ordering`: Sort by field (date, -date, amount, -amount)
- `page`: Page number

Example: `/api/transactions/?date_from=2025-01-01&category=2&ordering=-date`

Response:
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/transactions/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "category": 2,
      "category_name": "Groceries",
      "category_type": "expense",
      "amount": "150.50",
      "date": "2025-01-15",
      "description": "Weekly shopping",
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### POST /api/transactions/
**Create a new transaction**

Request:
```json
{
  "category": 2,
  "amount": 150.50,
  "date": "2025-01-15",
  "description": "Weekly shopping"
}
```

#### PUT /api/transactions/{id}/
**Update a transaction**

Request:
```json
{
  "category": 2,
  "amount": 175.00,
  "date": "2025-01-15",
  "description": "Weekly shopping (updated)"
}
```

#### DELETE /api/transactions/{id}/
**Delete a transaction**

Response: 204 No Content

#### GET /api/transactions/summary/
**Get monthly summary**

Query Parameters:
- `month` (optional): YYYY-MM format

Example: `/api/transactions/summary/?month=2025-01`

Response:
```json
{
  "total_income": "5000.00",
  "total_expenses": "3250.75",
  "balance": "1749.25",
  "expenses_by_category": [
    {
      "category__name": "Groceries",
      "total": "850.50"
    },
    {
      "category__name": "Rent",
      "total": "1500.00"
    }
  ]
}
```

### Budget Endpoints

#### GET /api/budgets/
**List all budgets**

Query Parameters:
- `year`: Filter by year
- `month`: Filter by month (1-12)

Example: `/api/budgets/?year=2025&month=1`

Response:
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "year": 2025,
      "month": 1,
      "amount": "3000.00",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/budgets/
**Create a new budget**

Request:
```json
{
  "year": 2025,
  "month": 1,
  "amount": 3000.00
}
```

Note: Only one budget per user per month is allowed.

#### PUT /api/budgets/{id}/
**Update a budget**

Request:
```json
{
  "year": 2025,
  "month": 1,
  "amount": 3500.00
}
```

#### DELETE /api/budgets/{id}/
**Delete a budget**

Response: 204 No Content

---

## 🔄 Development Workflow

### 1. Setting Up Development Environment

```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### 2. Making Changes

#### Adding a New Model

1. **Define model** in `backend/finance/models.py`:
```python
class NewModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
```

2. **Create migration**:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. **Create serializer** in `backend/finance/serializers.py`:
```python
class NewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewModel
        fields = ['id', 'name']
```

4. **Create ViewSet** in `backend/finance/views.py`:
```python
class NewModelViewSet(BaseOwnedViewSet):
    queryset = NewModel.objects.all()
    serializer_class = NewModelSerializer
```

5. **Register URL** in `backend/finance/urls.py`:
```python
router.register(r'newmodels', NewModelViewSet, basename='newmodel')
```

#### Adding a New Page

1. **Create page component** in `frontend/src/pages/NewPage/`:
```javascript
// NewPage.jsx
export default function NewPage() {
  return (
    <div className="page-container">
      <PageHeader title="New Page" subtitle="Description" />
      {/* Content */}
    </div>
  );
}
```

2. **Add route** in `frontend/src/App.jsx`:
```javascript
<Route path="/newpage" element={<NewPage />} />
```

3. **Add navigation** in `frontend/src/components/layout/Navbar/Navbar.jsx`:
```javascript
const navItems = [
  // ...
  { path: '/newpage', label: 'New Page', icon: '📄' }
];
```

### 3. API Integration

**Frontend API call**:
```javascript
// 1. Add API method in frontend/src/api/index.js
export const api = {
  getNewData: () => request('/newmodels/'),
  createNewData: (data) => request('/newmodels/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// 2. Use in component
const loadData = async () => {
  const data = await api.getNewData();
  setData(data.results || data);
};
```

### 4. Debugging

**Backend**:
```python
# Add print statements
print(f"Debug: {variable}")

# Use Django shell
python manage.py shell
>>> from finance.models import Transaction
>>> Transaction.objects.all()
```

**Frontend**:
```javascript
// Console logging
console.log('Debug:', data);

// React DevTools (browser extension)
// Network tab to inspect API calls
```

### 5. Common Issues & Solutions

#### Issue: CORS errors
**Solution**: Check `backend/budget_backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

#### Issue: 401 Unauthorized
**Solution**: Check if token is being sent:
```javascript
// In browser console
localStorage.getItem('token')
```

#### Issue: Database locked
**Solution**: Close all connections and restart server

#### Issue: Module not found
**Solution**:
```bash
# Backend
pip install <package>

# Frontend
npm install <package>
```

---

## 📊 Database Schema

```sql
-- Users (Django built-in)
auth_user (id, username, password, email, ...)

-- Categories
finance_category (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    name VARCHAR(100),
    type VARCHAR(7),  -- 'income' or 'expense'
    created_at DATETIME
)

-- Budgets
finance_budget (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    year INTEGER,
    month INTEGER,
    amount DECIMAL(12,2),
    created_at DATETIME,
    UNIQUE(user_id, year, month)
)

-- Transactions
finance_transaction (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    category_id INTEGER FOREIGN KEY,
    amount DECIMAL(12,2),
    date DATE,
    description TEXT,
    created_at DATETIME
)
```

---

## 🎓 Learning Resources

### Django
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django ORM Tutorial](https://docs.djangoproject.com/en/4.2/topics/db/queries/)

### React
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [D3.js Documentation](https://d3js.org/)

### JWT Authentication
- [JWT.io](https://jwt.io/)
- [Simple JWT Docs](https://django-rest-framework-simplejwt.readthedocs.io/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy Coding! 🚀**
