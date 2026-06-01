from decimal import Decimal

from django.utils import timezone
from django.db.models import Sum

from sales.models import Sale


def get_daily_sales_report():

    today = timezone.now().date()

    sales = Sale.objects.filter(created_at__date=today)

    total_sales = sales.aggregate(total=Sum("total_amount"))["total"] or Decimal("0.00")

    total_paid = sales.aggregate(total=Sum("paid_amount"))["total"] or Decimal("0.00")

    total_balance = sales.aggregate(total=Sum("balance"))["total"] or Decimal("0.00")

    return {
        "date": today,
        "total_transactions": sales.count(),
        "total_sales": total_sales,
        "total_paid": total_paid,
        "total_balance": total_balance,
    }


def get_cashier_sales_report():

    sales = Sale.objects.select_related("cashier")

    report = {}

    for sale in sales:

        cashier = sale.cashier.username

        if cashier not in report:

            report[cashier] = {
                "transactions": 0,
                "total_sales": Decimal("0.00"),
            }

        report[cashier]["transactions"] += 1

        report[cashier]["total_sales"] += sale.total_amount

    return report


def get_outstanding_debt_report():

    debts = Sale.objects.filter(balance__gt=0).order_by("-created_at")

    data = []

    for sale in debts:

        data.append(
            {
                "receipt_number": sale.receipt_number,
                "customer_name": sale.customer_name,
                "customer_phone": sale.customer_phone,
                "balance": sale.balance,
                "payment_status": sale.payment_status,
            }
        )

    return data
