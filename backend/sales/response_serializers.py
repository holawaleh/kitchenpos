from django.db.models import Count, Sum

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

    customer_payment_summary = serializers.SerializerMethodField()

    def get_repayment_count(self, obj):

        return obj.payments.filter(payment_type="REPAYMENT").count()

    def get_remaining_repayment_slots(self, obj):

        return max(
            MAX_REPAYMENTS_PER_SALE - self.get_repayment_count(obj),
            0,
        )

    def get_customer_payment_summary(self, obj):

        customer_name = (obj.customer_name or "").strip()
        customer_phone = (obj.customer_phone or "").strip()

        if customer_phone:

            customer_sales = Sale.objects.filter(customer_phone=customer_phone)

        elif customer_name:

            customer_sales = Sale.objects.filter(customer_name__iexact=customer_name)

        else:

            customer_sales = Sale.objects.filter(id=obj.id)

        summary = customer_sales.aggregate(
            sale_count=Count("id"),
            total_amount=Sum("total_amount"),
            paid_amount=Sum("paid_amount"),
            outstanding_balance=Sum("balance"),
        )

        return {
            "customer_name": customer_name or "Walk-in",
            "customer_phone": customer_phone,
            "sale_count": summary["sale_count"] or 0,
            "total_amount": summary["total_amount"] or 0,
            "paid_amount": summary["paid_amount"] or 0,
            "outstanding_balance": summary["outstanding_balance"] or 0,
            "unpaid_sales": customer_sales.filter(payment_status="UNPAID").count(),
            "partial_sales": customer_sales.filter(payment_status="PARTIAL").count(),
            "last_purchase_at": customer_sales.order_by("-created_at")
            .values_list("created_at", flat=True)
            .first(),
        }

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
            "customer_payment_summary",
            "created_at",
            "items",
            "payments",
        ]


class ReceiptSerializer(SaleDetailSerializer):

    pass
