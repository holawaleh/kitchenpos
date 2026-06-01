from django.db import models

from sales.models import Sale

from accounts.models import User

from common.constants import (
    PAYMENT_METHODS,
)

from common.models import BaseModel


PAYMENT_TYPES = (
    ("INITIAL", "Initial payment"),
    ("REPAYMENT", "Repayment"),
)

MAX_REPAYMENTS_PER_SALE = 5


class Payment(BaseModel):

    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name="payments")

    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)

    payment_type = models.CharField(
        max_length=20,
        choices=PAYMENT_TYPES,
        default="INITIAL",
    )

    sequence_number = models.PositiveSmallIntegerField(default=0)

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    reference = models.CharField(max_length=255, blank=True, null=True)

    received_by = models.ForeignKey(User, on_delete=models.PROTECT)

    note = models.TextField(blank=True, null=True)

    def __str__(self):

        return f"{self.sale.receipt_number}" f" - " f"{self.payment_method}"

    class Meta:
        indexes = [
            models.Index(fields=["created_at", "payment_method"]),
            models.Index(fields=["sale", "created_at"]),
            models.Index(fields=["sale", "payment_type", "sequence_number"]),
        ]
