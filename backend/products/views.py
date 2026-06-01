from django.shortcuts import get_object_or_404

from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from rest_framework import status

from .models import Product

from rest_framework.generics import ListAPIView

from rest_framework.filters import SearchFilter

from .serializers import (
    POSProductSerializer,
)

from .serializers import (
    ProductReadSerializer,
    ProductWriteSerializer,
)

from common.pagination import StandardResultsPagination


class ProductListView(APIView):

    permission_classes = [IsAuthenticated]

    pagination_class = StandardResultsPagination

    def get(self, request):

        products = (
            Product.objects.select_related("menu")
            .filter(is_active=True)
            .order_by("name")
        )

        search = request.GET.get("search")

        menu = request.GET.get("menu")

        status_filter = request.GET.get("status")

        if search:

            products = products.filter(name__icontains=search)

        if menu:

            products = products.filter(menu_id=menu)

        if status_filter:

            products = products.filter(status=status_filter)

        paginator = self.pagination_class()

        paginated_products = paginator.paginate_queryset(products, request)

        serializer = ProductReadSerializer(paginated_products, many=True)

        return paginator.get_paginated_response(serializer.data)

    def post(self, request):

        serializer = ProductWriteSerializer(data=request.data)

        if serializer.is_valid():

            product = serializer.save()

            response_serializer = ProductReadSerializer(product)

            return Response(
                {
                    "success": True,
                    "message": "Product created successfully",
                    "data": response_serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class ProductDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):

        return get_object_or_404(Product, pk=pk, is_active=True)

    def get(self, request, pk):

        product = self.get_object(pk)

        serializer = ProductReadSerializer(product)

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )

    def patch(self, request, pk):

        product = self.get_object(pk)

        serializer = ProductWriteSerializer(product, data=request.data, partial=True)

        if serializer.is_valid():

            product = serializer.save()

            response_serializer = ProductReadSerializer(product)

            return Response(
                {
                    "success": True,
                    "message": "Product updated successfully",
                    "data": response_serializer.data,
                }
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request, pk):

        product = self.get_object(pk)

        serializer = ProductWriteSerializer(product, data=request.data)

        if serializer.is_valid():

            product = serializer.save()

            response_serializer = ProductReadSerializer(product)

            return Response(
                {
                    "success": True,
                    "message": "Product updated successfully",
                    "data": response_serializer.data,
                }
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):

        product = self.get_object(pk)

        product.is_active = False

        product.save()

        return Response({"success": True, "message": "Product archived successfully"})


class ProductBarcodeSearchView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        barcode = request.GET.get("barcode")

        if not barcode:

            return Response({"success": False, "message": "Barcode required"})

        try:

            product = Product.objects.select_related("menu").get(
                barcode=barcode, is_active=True
            )

        except Product.DoesNotExist:

            return Response({"success": False, "message": "Product not found"})

        serializer = ProductReadSerializer(product)

        return Response(
            {
                "success": True,
                "data": serializer.data,
            }
        )


class POSProductListView(ListAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = POSProductSerializer

    pagination_class = StandardResultsPagination

    queryset = (
        Product.objects.select_related("stock")
        .filter(
            is_active=True,
            status="AVAILABLE",
        )
        .order_by("name")
    )

    filter_backends = [
        SearchFilter,
    ]

    search_fields = [
        "name",
        "barcode",
    ]
