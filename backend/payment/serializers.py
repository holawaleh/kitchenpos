from rest_framework import serializers

from sales.models import Sale

from .models import Payment

from .services import (
    update_sale_payment_status,
)


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

        payment = Payment.objects.create(
            sale=sale,
            amount=validated_data["amount"],
            payment_method=validated_data["payment_method"],
            reference=validated_data.get("reference"),
            note=validated_data.get("note"),
            received_by=request.user,
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
            "amount",
            "reference",
            "received_by_name",
            "note",
            "created_at",
        ]
