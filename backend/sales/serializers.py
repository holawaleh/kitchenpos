from decimal import Decimal

from django.db import transaction

from rest_framework import serializers

from products.models import Product

from inventory.models import StockItem

from payment.models import Payment

from inventory.services import deduct_stock

from audit.services import create_audit_log

from common.auth import get_request_user

from .models import (
    Sale,
    SaleItem,
)

from .services import (
    generate_receipt_number,
)


class SaleItemInputSerializer(serializers.Serializer):

    product_id = serializers.IntegerField()

    quantity = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    def validate_quantity(self, value):

        if value <= 0:

            raise serializers.ValidationError("Quantity must be greater than zero")

        return value


class SaleCreateSerializer(serializers.Serializer):

    customer_name = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    customer_phone = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    payment_method = serializers.CharField()

    amount_paid = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    note = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    items = SaleItemInputSerializer(many=True)

    def validate_items(self, value):

        if not value:

            raise serializers.ValidationError("Sale must contain at least one item")

        return value

    @transaction.atomic
    def create(self, validated_data):

        request = self.context["request"]

        items_data = validated_data.pop("items")

        actor = get_request_user(request)

        total_amount = Decimal("0.00")

        validated_products = []

        # VALIDATE PRODUCTS + STOCK
        for item in items_data:

            try:
                product = Product.objects.select_related("stock").get(
                    id=item["product_id"],
                    is_active=True,
                )
            except Product.DoesNotExist:
                raise serializers.ValidationError("Product not found")

            if product.status != "AVAILABLE":

                raise serializers.ValidationError(f"{product.name} " f"is unavailable")

            try:
                stock_item = StockItem.objects.select_for_update().get(product=product)
            except StockItem.DoesNotExist:
                raise serializers.ValidationError(f"No stock record for {product.name}")

            if stock_item.quantity < item["quantity"]:

                raise serializers.ValidationError(
                    f"Insufficient stock " f"for " f"{product.name}"
                )

            subtotal = product.default_price * item["quantity"]

            total_amount += subtotal

            validated_products.append(
                {
                    "product": product,
                    "quantity": item["quantity"],
                    "subtotal": subtotal,
                }
            )

        amount_paid = validated_data["amount_paid"]

        if amount_paid < 0:

            raise serializers.ValidationError("Amount paid cannot be negative")

        balance = total_amount - amount_paid

        # DETERMINE STATUS
        if amount_paid >= total_amount:

            payment_status = "PAID"

        elif amount_paid > 0:

            payment_status = "PARTIAL"

        else:

            payment_status = "UNPAID"

        # CREATE SALE
        sale = Sale.objects.create(
            cashier=actor,
            receipt_number=(generate_receipt_number()),
            customer_name=(validated_data.get("customer_name")),
            customer_phone=(validated_data.get("customer_phone")),
            payment_method=(validated_data["payment_method"]),
            total_amount=(total_amount),
            paid_amount=(amount_paid),
            balance=(balance),
            payment_status=(payment_status),
        )

        # AUDIT LOG
        create_audit_log(
            user=actor,
            action="SALE_CREATED",
            target_type="Sale",
            target_id=sale.id,
            description=(f"Created sale " f"{sale.receipt_number}"),
            metadata={
                "total_amount": str(sale.total_amount),
                "payment_status": sale.payment_status,
            },
        )

        # CREATE SALE ITEMS
        for item in validated_products:

            SaleItem.objects.create(
                sale=sale,
                product=item["product"],
                product_name_snapshot=(item["product"].name),
                quantity=item["quantity"],
                unit_price=(item["product"].default_price),
                subtotal=item["subtotal"],
            )

            deduct_stock(
                product=item["product"],
                quantity=item["quantity"],
                performed_by=actor,
                note=(f"Sale " f"{sale.receipt_number}"),
            )

        # CREATE PAYMENT RECORD
        if amount_paid > 0:

            Payment.objects.create(
                sale=sale,
                payment_method=(validated_data["payment_method"]),
                payment_type="INITIAL",
                sequence_number=0,
                amount=(amount_paid),
                received_by=actor,
                note=(validated_data.get("note")),
            )

        return sale
