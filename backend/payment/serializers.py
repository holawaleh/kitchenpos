from rest_framework import serializers

from sales.models import Sale

from .models import MAX_REPAYMENTS_PER_SALE, Payment

from .services import (
    update_sale_payment_status,
)

from common.auth import get_request_user


class PaymentCreateSerializer(serializers.Serializer):

    sale_id = serializers.IntegerField()

    amount = serializers.DecimalField(max_digits=12, decimal_places=2)

    payment_method = serializers.CharField()

    reference = serializers.CharField(required=False, allow_blank=True)

    note = serializers.CharField(required=False, allow_blank=True)

    def validate_amount(self, value):

        if value <= 0:

            raise serializers.ValidationError("Amount must be greater than zero")

        return value

    def create(self, validated_data):

        request = self.context["request"]

        sale = Sale.objects.get(id=validated_data["sale_id"])

        if sale.balance <= 0:

            raise serializers.ValidationError("Sale already fully paid")

        if validated_data["amount"] > sale.balance:

            raise serializers.ValidationError("Payment exceeds outstanding balance")

        repayment_count = sale.payments.filter(payment_type="REPAYMENT").count()

        if repayment_count >= MAX_REPAYMENTS_PER_SALE:

            raise serializers.ValidationError(
                "Maximum of 5 repayments reached for this sale"
            )

        payment = Payment.objects.create(
            sale=sale,
            amount=validated_data["amount"],
            payment_method=validated_data["payment_method"],
            payment_type="REPAYMENT",
            sequence_number=repayment_count + 1,
            reference=validated_data.get("reference"),
            note=validated_data.get("note"),
            received_by=get_request_user(request),
        )

        update_sale_payment_status(sale)

        return payment


class PaymentSerializer(serializers.ModelSerializer):

    sale_receipt_number = serializers.CharField(
        source="sale.receipt_number", read_only=True
    )

    received_by_name = serializers.CharField(
        source="received_by.full_name", read_only=True
    )

    class Meta:

        model = Payment

        fields = [
            "id",
            "sale",
            "sale_receipt_number",
            "payment_method",
            "payment_type",
            "sequence_number",
            "amount",
            "reference",
            "received_by_name",
            "note",
            "created_at",
        ]
