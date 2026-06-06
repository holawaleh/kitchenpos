from django.db import models

from accounts.models import User

from products.models import Product

from common.constants import (
    PAYMENT_STATUS,
    PAYMENT_METHODS,
)

from common.models import BaseModel


class Sale(BaseModel):

    receipt_number = models.CharField(max_length=50, unique=True, db_index=True)

    cashier = models.ForeignKey(User, on_delete=models.PROTECT, related_name="sales")

    customer_name = models.CharField(max_length=255, blank=True, null=True)

    customer_phone = models.CharField(max_length=20, blank=True, null=True)

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS,
        default="CASH",
    )

    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS, default="UNPAID"
    )

    receipt_printed = models.BooleanField(default=False)

    def __str__(self):

        return self.receipt_number

    class Meta:
        indexes = [
            models.Index(fields=["payment_status", "created_at"]),
            models.Index(fields=["cashier", "created_at"]),
        ]


class Extra(BaseModel):

    name = models.CharField(max_length=255, unique=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)

    is_available = models.BooleanField(default=True)

    def __str__(self):

        return self.name


class SaleItem(BaseModel):

    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name="items")

    product = models.ForeignKey(Product, on_delete=models.PROTECT)

    product_name_snapshot = models.CharField(max_length=255)

    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)

    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):

        return self.product_name_snapshot

    class Meta:
        indexes = [
            models.Index(fields=["sale", "product"]),
            models.Index(fields=["product_name_snapshot"]),
        ]


class SaleItemExtra(BaseModel):

    sale_item = models.ForeignKey(
        SaleItem, on_delete=models.CASCADE, related_name="extras"
    )

    extra = models.ForeignKey(Extra, on_delete=models.PROTECT)

    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):

        return f"{self.extra.name}"
