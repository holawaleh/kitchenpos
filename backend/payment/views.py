from rest_framework.generics import (
    ListAPIView,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from common.pagination import (
    StandardResultsPagination,
)

from .models import Payment

from .serializers import (
    PaymentSerializer,
)

from rest_framework.views import (
    APIView,
)

from rest_framework.response import (
    Response,
)

from rest_framework import status

from .repayment_serializers import (
    RepaymentSerializer,
)


class PaymentListView(ListAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = PaymentSerializer

    pagination_class = StandardResultsPagination

    queryset = Payment.objects.select_related(
        "sale",
        "received_by",
    ).order_by("-created_at")


class RepaymentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = RepaymentSerializer(
            data=request.data, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        sale = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Repayment successful",
                "data": {
                    "sale_id": sale.id,
                    "receipt_number": sale.receipt_number,
                    "paid_amount": sale.paid_amount,
                    "balance": sale.balance,
                    "payment_status": sale.payment_status,
                },
            },
            status=(status.HTTP_200_OK),
        )
