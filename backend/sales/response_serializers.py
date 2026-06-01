from rest_framework import serializers

from payment.models import MAX_REPAYMENTS_PER_SALE, Payment

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
            "id",
            "amount",
            "payment_method",
            "payment_type",
            "sequence_number",
            "reference",
            "note",
            "created_at",
        ]


class SaleListSerializer(serializers.ModelSerializer):

    cashier_name = serializers.CharField(
        source="cashier.full_name",
        read_only=True,
    )

    amount_paid = serializers.DecimalField(
        source="paid_amount",
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    repayment_count = serializers.SerializerMethodField()

    remaining_repayment_slots = serializers.SerializerMethodField()

    def get_repayment_count(self, obj):

        if hasattr(obj, "repayment_count"):

            return obj.repayment_count

        return obj.payments.filter(payment_type="REPAYMENT").count()

    def get_remaining_repayment_slots(self, obj):

        return max(
            MAX_REPAYMENTS_PER_SALE - self.get_repayment_count(obj),
            0,
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
            "amount_paid",
            "balance",
            "payment_status",
            "repayment_count",
            "remaining_repayment_slots",
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

    amount_paid = serializers.DecimalField(
        source="paid_amount",
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    repayment_count = serializers.SerializerMethodField()

    remaining_repayment_slots = serializers.SerializerMethodField()

    def get_repayment_count(self, obj):

        return obj.payments.filter(payment_type="REPAYMENT").count()

    def get_remaining_repayment_slots(self, obj):

        return max(
            MAX_REPAYMENTS_PER_SALE - self.get_repayment_count(obj),
            0,
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
            "amount_paid",
            "balance",
            "repayment_count",
            "remaining_repayment_slots",
            "created_at",
            "items",
            "payments",
        ]


class ReceiptSerializer(SaleDetailSerializer):

    pass
