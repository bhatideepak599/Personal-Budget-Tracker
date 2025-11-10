from rest_framework import viewsets, permissions, decorators, response
from rest_framework.views import APIView
from django.db.models import Sum
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer
from .permissions import IsOwner
from .filters import TransactionFilter


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

# Create your views here.
