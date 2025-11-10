from rest_framework import viewsets, permissions, decorators, response, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.db.models import Sum
from django.contrib.auth import get_user_model
from django.shortcuts import render
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer
from .permissions import IsOwner
from .filters import TransactionFilter

User = get_user_model()


class BaseOwnedViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryViewSet(BaseOwnedViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filterset_fields = ["type"]


class BudgetViewSet(BaseOwnedViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    filterset_fields = ["year", "month"]


class TransactionViewSet(BaseOwnedViewSet):
    queryset = Transaction.objects.select_related("category").all()
    serializer_class = TransactionSerializer
    filterset_class = TransactionFilter
    filterset_fields = ["category"]
    ordering_fields = ["date", "amount", "id"]

    @decorators.action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        """Return totals and category breakdown, optionally for a given month (YYYY-MM)."""
        month = request.query_params.get("month")
        qs = self.get_queryset()
        if month:
            try:
                y, m = month.split("-")
                y = int(y); m = int(m)
                qs = qs.filter(date__year=y, date__month=m)
            except Exception:
                pass

        totals = qs.values("category__type").annotate(total=Sum("amount"))
        total_income = sum(t["total"] for t in totals if t["category__type"] == Category.TYPE_INCOME) or 0
        total_expenses = sum(t["total"] for t in totals if t["category__type"] == Category.TYPE_EXPENSE) or 0
        balance = (total_income or 0) - (total_expenses or 0)

        expenses_by_category = (
            qs.filter(category__type=Category.TYPE_EXPENSE)
            .values("category__name")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )

        data = {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "balance": balance,
            "expenses_by_category": list(expenses_by_category),
        }
        return response.Response(data)


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def create_test_user(request):
    """
    Create a test user for initial setup.
    This endpoint is public and should be disabled in production after initial setup.

    POST /api/create-test-user/
    GET /api/create-test-user/ - Returns info about test user
    """
    username = "testuser"
    email = "test@example.com"
    password = "testpass123"

    if request.method == 'GET':
        # Check if user exists
        user_exists = User.objects.filter(username=username).exists()
        return response.Response({
            "message": "Test user endpoint",
            "username": username,
            "user_exists": user_exists,
            "instructions": "Send a POST request to this endpoint to create the test user"
        })

    # POST request - create user
    try:
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return response.Response({
                "message": "Test user already exists",
                "username": username,
                "password": password,
                "status": "exists"
            }, status=status.HTTP_200_OK)

        # Create the user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # Create some default categories for the user
        default_categories = [
            {"name": "Salary", "type": Category.TYPE_INCOME},
            {"name": "Freelance", "type": Category.TYPE_INCOME},
            {"name": "Food", "type": Category.TYPE_EXPENSE},
            {"name": "Transport", "type": Category.TYPE_EXPENSE},
            {"name": "Entertainment", "type": Category.TYPE_EXPENSE},
            {"name": "Utilities", "type": Category.TYPE_EXPENSE},
        ]

        for cat_data in default_categories:
            Category.objects.create(
                user=user,
                name=cat_data["name"],
                type=cat_data["type"]
            )

        return response.Response({
            "message": "Test user created successfully!",
            "username": username,
            "password": password,
            "email": email,
            "status": "created",
            "categories_created": len(default_categories),
            "next_step": "You can now login with these credentials"
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return response.Response({
            "error": str(e),
            "message": "Failed to create test user"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def create_test_user_page(request):
    """
    Render a simple HTML page to create test user.
    Access at: /setup/
    """
    return render(request, 'create_test_user.html')
