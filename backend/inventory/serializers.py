from rest_framework import serializers

from products.models import Product

from .models import (
    StockItem,
    StockMovement,
)


class ProductMiniSerializer(serializers.ModelSerializer):

    class Meta:

        model = Product

        fields = [
            "id",
            "name",
            "barcode",
        ]


class StockItemSerializer(serializers.ModelSerializer):

    product = ProductMiniSerializer(read_only=True)

    class Meta:

        model = StockItem

        fields = [
            "id",
            "product",
            "quantity",
            "low_stock_threshold",
            "updated_at",
        ]


class StockAdjustmentSerializer(serializers.Serializer):

    product_id = serializers.IntegerField()

    quantity = serializers.DecimalField(max_digits=12, decimal_places=2)

    note = serializers.CharField(required=False, allow_blank=True)

    def validate_quantity(self, value):

        if value <= 0:

            raise serializers.ValidationError("Quantity must be greater than zero")

        return value


class StockMovementSerializer(serializers.ModelSerializer):

    product = ProductMiniSerializer(read_only=True)

    performed_by = serializers.SerializerMethodField()

    class Meta:

        model = StockMovement

        fields = [
            "id",
            "product",
            "movement_type",
            "quantity",
            "note",
            "performed_by",
            "created_at",
        ]

    def get_performed_by(self, obj):

        if obj.performed_by:

            return obj.performed_by.username

        return None
