from rest_framework import serializers

from payment.models import Payment

from .models import (
    Sale,
    SaleItem,
)


class SaleItemReceiptSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source=("product_name_snapshot"),
        read_only=True,
    )

    class Meta:

        model = SaleItem

        fields = [
            "product_name",
            "quantity",
            "unit_price",
            "subtotal",
        ]


class PaymentHistorySerializer(serializers.ModelSerializer):

    class Meta:

        model = Payment

        fields = [
            "amount",
            "payment_method",
            "created_at",
        ]


class SaleListSerializer(serializers.ModelSerializer):

    cashier_name = serializers.CharField(
        source="cashier.full_name",
        read_only=True,
    )

    class Meta:

        model = Sale

        fields = [
            "id",
            "receipt_number",
            "cashier_name",
            "customer_name",
            "total_amount",
            "paid_amount",
            "balance",
            "payment_status",
            "created_at",
        ]


class SaleDetailSerializer(serializers.ModelSerializer):

    cashier_name = serializers.CharField(
        source="cashier.full_name",
        read_only=True,
    )

    items = SaleItemReceiptSerializer(
        many=True,
        read_only=True,
    )

    payments = PaymentHistorySerializer(
        many=True,
        read_only=True,
    )

    class Meta:

        model = Sale

        fields = [
            "id",
            "receipt_number",
            "cashier_name",
            "customer_name",
            "customer_phone",
            "payment_method",
            "payment_status",
            "total_amount",
            "paid_amount",
            "balance",
            "created_at",
            "items",
            "payments",
        ]


class ReceiptSerializer(SaleDetailSerializer):

    pass
