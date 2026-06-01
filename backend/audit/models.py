from django.db import models

from accounts.models import User

from common.models import BaseModel


class AuditLog(BaseModel):

    ACTION_CHOICES = [
        ("SALE_CREATED", "Sale Created"),
        ("PAYMENT_RECEIVED", "Payment Received"),
        ("REPAYMENT_RECEIVED", "Repayment Received"),
        ("STOCK_ADDED", "Stock Added"),
        ("STOCK_DEDUCTED", "Stock Deducted"),
        ("PRODUCT_CREATED", "Product Created"),
        ("PRODUCT_UPDATED", "Product Updated"),
        ("PRODUCT_DELETED", "Product Deleted"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )

    action = models.CharField(
        max_length=50,
        choices=ACTION_CHOICES,
    )

    target_type = models.CharField(max_length=100)

    target_id = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    description = models.TextField()

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    def __str__(self):

        return f"{self.action} - " f"{self.target_type}"
