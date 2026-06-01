from decimal import Decimal

from django.db import transaction

from rest_framework import serializers

from sales.models import Sale

from audit.services import (
    create_audit_log,
)

from common.auth import get_request_user

from .models import Payment


class RepaymentSerializer(serializers.Serializer):

    sale_id = serializers.IntegerField()

    payment_method = serializers.CharField()

    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    reference = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    note = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    @transaction.atomic
    def create(self, validated_data):

        request = self.context["request"]

        actor = get_request_user(request)

        try:
            sale = Sale.objects.select_for_update().get(id=validated_data["sale_id"])
        except Sale.DoesNotExist:
            raise serializers.ValidationError("Sale not found")

        repayment_amount = validated_data["amount"]

        if repayment_amount <= 0:

            raise serializers.ValidationError(
                "Repayment amount must be greater than zero"
            )

        if sale.balance <= 0:

            raise serializers.ValidationError("Sale already fully paid")

        if repayment_amount > sale.balance:

            raise serializers.ValidationError("Repayment exceeds outstanding balance")

        # CREATE PAYMENT
        Payment.objects.create(
            sale=sale,
            payment_method=(validated_data["payment_method"]),
            amount=(repayment_amount),
            reference=(validated_data.get("reference")),
            received_by=actor,
            note=(validated_data.get("note")),
        )

        # UPDATE SALE
        sale.paid_amount += repayment_amount

        sale.balance -= repayment_amount

        if sale.balance == Decimal("0.00"):

            sale.payment_status = "PAID"

        else:

            sale.payment_status = "PARTIAL"

        sale.save(
            update_fields=[
                "paid_amount",
                "balance",
                "payment_status",
                "updated_at",
            ]
        )

        # AUDIT LOG
        create_audit_log(
            user=actor,
            action=("REPAYMENT_RECEIVED"),
            target_type="Sale",
            target_id=sale.id,
            description=(f"Repayment received " f"for " f"{sale.receipt_number}"),
            metadata={
                "amount": str(repayment_amount),
                "balance": str(sale.balance),
            },
        )

        return sale
