from decimal import Decimal

from sales.models import Sale

from .models import Payment


def update_sale_payment_status(sale):

    payments = Payment.objects.filter(sale=sale)

    total_paid = Decimal("0.00")

    for payment in payments:

        total_paid += payment.amount

    sale.paid_amount = total_paid

    sale.balance = sale.total_amount - total_paid

    if sale.balance <= 0:

        sale.payment_status = "PAID"

    elif total_paid > 0:

        sale.payment_status = "PARTIAL"

    else:

        sale.payment_status = "UNPAID"

    sale.save()

    return sale
