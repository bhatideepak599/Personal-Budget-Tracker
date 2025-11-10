from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Category(models.Model):
    TYPE_INCOME = 'income'
    TYPE_EXPENSE = 'expense'
    TYPE_CHOICES = [
        (TYPE_INCOME, 'Income'),
        (TYPE_EXPENSE, 'Expense'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=7, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'name', 'type')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.type})"


class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    year = models.IntegerField()
    month = models.IntegerField()  # 1-12
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'year', 'month')
        ordering = ['-year', '-month']

    def __str__(self):
        return f"{self.user} {self.year}-{self.month:02d}: {self.amount}"


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-id']

    def __str__(self):
        return f"{self.date} {self.category.name} {self.amount}"

# Create your models here.
