from django.contrib import admin
from .models import Category, Transaction, Budget

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "type", "created_at")
    list_filter = ("type",)
    search_fields = ("name", "user__username")

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "date", "category", "amount")
    list_filter = ("category__type", "date")
    search_fields = ("description",)

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "year", "month", "amount")
    list_filter = ("year", "month")

# Register your models here.
