from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Transaction, Budget

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "type"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ["id", "year", "month", "amount"]

    def validate(self, data):
        user = self.context["request"].user
        year = data.get("year")
        month = data.get("month")

        # Check if budget already exists for this month (only on create)
        if not self.instance and Budget.objects.filter(user=user, year=year, month=month).exists():
            raise serializers.ValidationError(
                f"Budget for {year}-{month:02d} already exists. Please update the existing budget instead."
            )

        return data

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_type = serializers.CharField(source="category.type", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "date",
            "category",
            "category_name",
            "category_type",
            "amount",
            "description",
        ]

    def validate(self, attrs):
        request = self.context.get("request")
        cat = attrs.get("category") or getattr(self.instance, "category", None)
        if cat and request and cat.user_id != request.user.id:
            raise serializers.ValidationError({"category": "Category does not belong to the user."})
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

