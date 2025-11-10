from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = "Create a default test user if it doesn't exist"

    def handle(self, *args, **options):
        User = get_user_model()
        username = "testuser"
        email = "test@example.com"
        password = "testpass123"
        user, created = User.objects.get_or_create(username=username, defaults={"email": email})
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created user {username}/{password}"))
        else:
            self.stdout.write(self.style.WARNING("Test user already exists"))

