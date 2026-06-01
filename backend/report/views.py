from django.db.models import (
    Sum,
    Count,
)

from django.utils import timezone

from rest_framework.views import (
    APIView,
)

from rest_framework.permissions import (
    AllowAny,
)

from rest_framework.response import (
    Response,
)

from sales.models import (
    Sale,
    SaleItem,
)

from products.models import Product

from inventory.models import StockItem

from payment.models import Payment


class DashboardSummaryView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        today = timezone.now().date()

        today_sales = (
            Sale.objects.filter(created_at__date=today).aggregate(
                total=Sum("paid_amount")
            )["total"]
            or 0
        )

        today_transactions = Sale.objects.filter(created_at__date=today).count()

        total_products = Product.objects.filter(is_active=True).count()

        low_stock_count = StockItem.objects.filter(quantity__lte=5).count()

        unpaid_sales_count = Sale.objects.filter(
            payment_status__in=[
                "UNPAID",
                "PARTIAL",
            ]
        ).count()

        outstanding_balance = (
            Sale.objects.filter(
                payment_status__in=[
                    "UNPAID",
                    "PARTIAL",
                ]
            ).aggregate(
                total=Sum("balance")
            )["total"]
            or 0
        )

        return Response(
            {
                "today_sales": today_sales,
                "today_transactions": today_transactions,
                "total_products": total_products,
                "low_stock_count": low_stock_count,
                "unpaid_sales_count": unpaid_sales_count,
                "outstanding_balance": outstanding_balance,
            }
        )


class DailySalesReportView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        today = timezone.now().date()

        sales = Sale.objects.filter(created_at__date=today).order_by("-created_at")

        total_sales = sales.aggregate(total=Sum("total_amount"))["total"] or 0

        total_received_today = (
            Payment.objects.filter(created_at__date=today).aggregate(
                total=Sum("amount")
            )["total"]
            or 0
        )

        total_balance = (
            Sale.objects.filter(
                payment_status__in=[
                    "PARTIAL",
                    "UNPAID",
                ]
            ).aggregate(
                total=Sum("balance")
            )["total"]
            or 0
        )

        return Response(
            {
                "date": today,
                "transactions": sales.count(),
                "total_sales": total_sales,
                "total_received_today": total_received_today,
                "total_balance": total_balance,
            }
        )


class RevenueSummaryView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        today = timezone.now().date()

        all_sales = Sale.objects.all()

        today_sales = all_sales.filter(created_at__date=today)

        today_revenue = today_sales.aggregate(total=Sum("total_amount"))["total"] or 0

        total_revenue = all_sales.aggregate(total=Sum("total_amount"))["total"] or 0

        paid_revenue = all_sales.aggregate(total=Sum("paid_amount"))["total"] or 0

        outstanding_debt = (
            all_sales.filter(payment_status__in=["PARTIAL", "UNPAID"]).aggregate(
                total=Sum("balance")
            )["total"]
            or 0
        )

        return Response(
            {
                "today_revenue": today_revenue,
                "total_revenue": total_revenue,
                "paid_revenue": paid_revenue,
                "outstanding_debt": outstanding_debt,
                "today_transactions": today_sales.count(),
                "total_transactions": all_sales.count(),
                "paid_sales": all_sales.filter(payment_status="PAID").count(),
                "debt_sales": all_sales.filter(
                    payment_status__in=["PARTIAL", "UNPAID"]
                ).count(),
            }
        )


class PaymentSummaryView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        summary = Sale.objects.values("payment_method").annotate(
            total=Sum("paid_amount")
        )

        response_data = {}

        for item in summary:

            response_data[item["payment_method"].lower()] = item["total"]

        return Response(response_data)


class DebtSummaryView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        partial_sales = Sale.objects.filter(payment_status="PARTIAL").count()

        unpaid_sales = Sale.objects.filter(payment_status="UNPAID").count()

        total_outstanding = (
            Sale.objects.filter(
                payment_status__in=[
                    "PARTIAL",
                    "UNPAID",
                ]
            ).aggregate(
                total=Sum("balance")
            )["total"]
            or 0
        )

        return Response(
            {
                "partial_sales": partial_sales,
                "unpaid_sales": unpaid_sales,
                "total_outstanding": total_outstanding,
            }
        )


class TopProductsView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        products = (
            SaleItem.objects.exclude(product_name_snapshot="")
            .exclude(product_name_snapshot__isnull=True)
            .values("product_name_snapshot")
            .annotate(
                total_quantity=Sum("quantity"),
                total_sales=Sum("subtotal"),
                transaction_count=Count("id"),
            )
            .order_by("-total_quantity")[:10]
        )

        return Response(products)
