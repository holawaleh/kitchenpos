from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from rest_framework import status

from products.models import Product

from common.pagination import StandardResultsPagination

from django.db.models import F

from .models import (
    StockItem,
    StockMovement,
)

from .serializers import (
    StockItemSerializer,
    StockAdjustmentSerializer,
    StockMovementSerializer,
)

from .services import (
    add_stock,
    deduct_stock,
)

from common.auth import get_request_user


class StockItemListView(APIView):

    permission_classes = [IsAuthenticated]

    pagination_class = StandardResultsPagination

    def get(self, request):

        stock_items = (
            StockItem.objects.select_related("product")
            .filter(is_active=True)
            .order_by("product__name")
        )

        search = request.GET.get("search")

        if search:

            stock_items = stock_items.filter(product__name__icontains=search)

        paginator = self.pagination_class()

        paginated_data = paginator.paginate_queryset(stock_items, request)

        serializer = StockItemSerializer(paginated_data, many=True)

        return paginator.get_paginated_response(serializer.data)


class AddStockView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = StockAdjustmentSerializer(data=request.data)

        if serializer.is_valid():

            product = get_object_or_404(
                Product, id=serializer.validated_data["product_id"], is_active=True
            )

            add_stock(
                product=product,
                quantity=serializer.validated_data["quantity"],
                performed_by=get_request_user(request),
                note=serializer.validated_data.get("note", ""),
            )

            return Response({"success": True, "message": "Stock added successfully"})

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class DeductStockView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = StockAdjustmentSerializer(data=request.data)

        if serializer.is_valid():

            product = get_object_or_404(
                Product, id=serializer.validated_data["product_id"], is_active=True
            )

            deduct_stock(
                product=product,
                quantity=serializer.validated_data["quantity"],
                performed_by=get_request_user(request),
                note=serializer.validated_data.get("note", ""),
            )

            return Response({"success": True, "message": "Stock deducted successfully"})

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class StockMovementListView(APIView):

    permission_classes = [IsAuthenticated]

    pagination_class = StandardResultsPagination

    def get(self, request):

        movements = (
            StockMovement.objects.select_related("product", "performed_by")
            .filter(is_active=True)
            .order_by("-created_at")
        )

        paginator = self.pagination_class()

        paginated_data = paginator.paginate_queryset(movements, request)

        serializer = StockMovementSerializer(paginated_data, many=True)

        return paginator.get_paginated_response(serializer.data)


class LowStockListView(ListAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = StockItemSerializer

    pagination_class = StandardResultsPagination

    queryset = (
        StockItem.objects.select_related("product")
        .filter(quantity__lte=F("low_stock_threshold"))
        .order_by("quantity")
    )
