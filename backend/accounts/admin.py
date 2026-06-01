from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    model = User

    list_display = (
        "username",
        "full_name",
        "role",
        "is_active",
        "is_staff",
        "created_at",
    )

    fieldsets = UserAdmin.fieldsets + (
        (
            "POS Information",
            {
                "fields": (
                    "full_name",
                    "role",
                    "phone_number",
                    "pin",
                    "must_change_password",
                    "temporary_password_expiry",
                )
            },
        ),
    )
