from django.db import models

from products.models import Product

from accounts.models import User

from common.constants import (
    STOCK_MOVEMENT_TYPES,
)

from common.models import BaseModel


class StockItem(BaseModel):

    product = models.OneToOneField(
        Product, on_delete=models.CASCADE, related_name="stock"
    )

    quantity = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    low_stock_threshold = models.DecimalField(
        max_digits=12, decimal_places=2, default=5
    )

    def __str__(self):

        return self.product.name

    class Meta:
        indexes = [
            models.Index(fields=["quantity", "low_stock_threshold"]),
        ]


class StockMovement(BaseModel):

    product = models.ForeignKey(
        Product, on_delete=models.PROTECT, related_name="stock_movements"
    )

    movement_type = models.CharField(max_length=10, choices=STOCK_MOVEMENT_TYPES)

    quantity = models.DecimalField(max_digits=12, decimal_places=2)

    performed_by = models.ForeignKey(User, on_delete=models.PROTECT)

    note = models.TextField(blank=True, null=True)

    def __str__(self):

        return f"{self.product.name} - " f"{self.movement_type}"

    class Meta:
        indexes = [
            models.Index(fields=["product", "created_at"]),
            models.Index(fields=["movement_type", "created_at"]),
        ]
