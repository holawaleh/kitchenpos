from django.db.models import Count, Prefetch, Q

from rest_framework import status

from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
)

from common.pagination import (
    StandardResultsPagination,
)

from .models import Sale

from payment.models import Payment

from .serializers import (
    SaleCreateSerializer,
)

from .response_serializers import (
    SaleListSerializer,
    SaleDetailSerializer,
    ReceiptSerializer,
)


class SaleCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = SaleCreateSerializer(
            data=request.data, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        sale = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Sale completed successfully",
                "data": {
                    "sale_id": sale.id,
                    "receipt_number": sale.receipt_number,
                    "total_amount": sale.total_amount,
                    "amount_paid": sale.paid_amount,
                    "balance": sale.balance,
                    "payment_status": sale.payment_status,
                },
            },
            status=(status.HTTP_201_CREATED),
        )


class SaleListView(ListAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = SaleListSerializer

    pagination_class = StandardResultsPagination

    def get_queryset(self):

        queryset = (
            Sale.objects.select_related("cashier")
            .annotate(
                repayment_count=Count(
                    "payments",
                    filter=Q(payments__payment_type="REPAYMENT"),
                )
            )
            .order_by("-created_at")
        )

        search = self.request.query_params.get("search")

        payment_status = self.request.query_params.get("payment_status")

        if search:

            queryset = queryset.filter(receipt_number__icontains=search)

        if payment_status:

            queryset = queryset.filter(payment_status=payment_status)

        return queryset


class SaleDetailView(RetrieveAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = SaleDetailSerializer

    queryset = Sale.objects.select_related("cashier").prefetch_related(
        "items",
        Prefetch("payments", queryset=Payment.objects.order_by("created_at")),
    )


class ReceiptView(RetrieveAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = ReceiptSerializer

    queryset = Sale.objects.select_related("cashier").prefetch_related(
        "items",
        Prefetch("payments", queryset=Payment.objects.order_by("created_at")),
    )
