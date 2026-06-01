from django.contrib.auth.models import (
    AbstractUser,
)

from django.db import models

from common.constants import (
    USER_ROLES,
)

from common.models import (
    BaseModel,
)


class User(AbstractUser, BaseModel):

    full_name = models.CharField(max_length=255)

    role = models.CharField(
        max_length=20,
        choices=USER_ROLES,
        default="CASHIER",
    )

    pin = models.CharField(
        max_length=128,
        blank=True,
        null=True,
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    must_change_password = models.BooleanField(default=True)

    temporary_password_expiry = models.DateTimeField(
        blank=True,
        null=True,
    )

    def __str__(self):

        return self.username
