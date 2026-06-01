from accounts.models import User


SYSTEM_USERNAME = "system_pos"


def get_system_user():
    user, _ = User.objects.get_or_create(
        username=SYSTEM_USERNAME,
        defaults={
            "full_name": "System POS",
            "role": "SUPERADMIN",
            "is_staff": True,
            "is_superuser": True,
            "must_change_password": False,
        },
    )

    if not user.has_usable_password():
        user.set_unusable_password()
        user.save(update_fields=["password", "updated_at"])

    return user


def get_request_user(request):
    user = getattr(request, "user", None)

    if user and user.is_authenticated:
        return user

    return get_system_user()
