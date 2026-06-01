from django.db import models

from common.constants import (
    PRODUCT_STATUS,
    PRODUCT_TYPES,
)

from common.models import BaseModel


class Menu(BaseModel):

    name = models.CharField(max_length=255, unique=True, db_index=True)

    description = models.TextField(blank=True, null=True)

    def __str__(self):

        return self.name


class Product(BaseModel):

    menu = models.ForeignKey(
        Menu, on_delete=models.SET_NULL, null=True, blank=True, related_name="products"
    )

    name = models.CharField(max_length=255, db_index=True)

    image = models.ImageField(upload_to="products/", blank=True, null=True)

    barcode = models.CharField(
        max_length=100, unique=True, blank=True, null=True, db_index=True
    )

    default_price = models.DecimalField(max_digits=10, decimal_places=2)

    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES)

    status = models.CharField(
        max_length=20, choices=PRODUCT_STATUS, default="AVAILABLE"
    )

    def __str__(self):

        return self.name

    class Meta:
        indexes = [
            models.Index(fields=["status", "is_active"]),
            models.Index(fields=["menu", "name"]),
        ]
