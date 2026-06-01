from rest_framework import serializers
from inventory.models import StockItem

from .models import (
    Menu,
    Product,
)


class MenuSerializer(serializers.ModelSerializer):

    class Meta:

        model = Menu

        fields = [
            "id",
            "name",
        ]


class ProductReadSerializer(serializers.ModelSerializer):

    menu = MenuSerializer(read_only=True)

    class Meta:

        model = Product

        fields = [
            "id",
            "menu",
            "name",
            "image",
            "barcode",
            "default_price",
            "product_type",
            "status",
        ]


class ProductWriteSerializer(serializers.ModelSerializer):

    menu_id = serializers.PrimaryKeyRelatedField(
        queryset=Menu.objects.all(),
        source="menu",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:

        model = Product

        fields = [
            "menu_id",
            "name",
            "image",
            "barcode",
            "default_price",
            "product_type",
            "status",
        ]

    def validate_default_price(self, value):

        if value <= 0:

            raise serializers.ValidationError("Price must be greater than zero")

        return value

    def validate_barcode(self, value):

        if value == "":

            return None

        return value

    def validate(self, attrs):

        name = attrs.get("name", getattr(self.instance, "name", None))

        menu = attrs.get("menu", getattr(self.instance, "menu", None))

        barcode = attrs.get("barcode", getattr(self.instance, "barcode", None))

        product_queryset = Product.objects.filter(
            name__iexact=name, menu=menu, is_active=True
        )

        if self.instance:

            product_queryset = product_queryset.exclude(id=self.instance.id)

        if product_queryset.exists():

            raise serializers.ValidationError(
                {"name": "Product already exists in this menu"}
            )

        if barcode:

            barcode_queryset = Product.objects.filter(barcode=barcode, is_active=True)

            if self.instance:

                barcode_queryset = barcode_queryset.exclude(id=self.instance.id)

            if barcode_queryset.exists():

                raise serializers.ValidationError({"barcode": "Barcode already exists"})

        return attrs

    def create(self, validated_data):

        product = Product.objects.create(**validated_data)

        StockItem.objects.create(product=product, quantity=0, low_stock_threshold=5)

        return product

    def update(self, instance, validated_data):

        for attr, value in validated_data.items():

            setattr(instance, attr, value)

        instance.save()

        return instance


class POSProductSerializer(serializers.ModelSerializer):

    quantity = serializers.SerializerMethodField()

    stock_status = serializers.SerializerMethodField()

    class Meta:

        model = Product

        fields = [
            "id",
            "name",
            "image",
            "barcode",
            "default_price",
            "product_type",
            "status",
            "quantity",
            "stock_status",
        ]

    def get_quantity(self, obj):

        if hasattr(obj, "stock"):

            return str(obj.stock.quantity)

        return "0.00"

    def get_stock_status(self, obj):

        if not hasattr(obj, "stock"):

            return "OUT_OF_STOCK"

        stock = obj.stock

        if stock.quantity <= 0:

            return "OUT_OF_STOCK"

        if stock.quantity <= stock.low_stock_threshold:

            return "LOW_STOCK"

        return "IN_STOCK"
