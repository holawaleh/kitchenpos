from django.contrib.auth.hashers import make_password
from django.db import migrations


def seed_admin_user(apps, schema_editor):
    User = apps.get_model("accounts", "User")

    user, _ = User.objects.get_or_create(
        username="admin",
        defaults={
            "full_name": "Kitchen POS Admin",
            "role": "SUPERADMIN",
            "is_staff": True,
            "is_superuser": True,
            "is_active": True,
            "must_change_password": False,
        },
    )

    user.full_name = user.full_name or "Kitchen POS Admin"
    user.role = "SUPERADMIN"
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.must_change_password = False
    user.temporary_password_expiry = None
    user.password = make_password("1234")
    user.save()


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_alter_user_role"),
    ]

    operations = [
        migrations.RunPython(seed_admin_user, migrations.RunPython.noop),
    ]
