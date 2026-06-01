from decimal import Decimal

from django.utils import timezone

from .models import (
    Sale,
    SaleItem,
    SaleItemExtra,
)


def generate_receipt_number():

    today = timezone.now().strftime("%Y%m%d")

    count = Sale.objects.filter(created_at__date=timezone.now().date()).count() + 1

    return f"POS-{today}-{count:04d}"


def calculate_sale_item_subtotal(sale_item):

    extras_total = Decimal("0.00")

    extras = SaleItemExtra.objects.filter(sale_item=sale_item)

    for extra in extras:

        extras_total += extra.price

    subtotal = (sale_item.unit_price * sale_item.quantity) + extras_total

    sale_item.subtotal = subtotal

    sale_item.save()

    return subtotal


def calculate_sale_totals(sale):

    items = SaleItem.objects.filter(sale=sale)

    total = Decimal("0.00")

    for item in items:

        total += item.subtotal

    sale.total_amount = total

    sale.balance = sale.total_amount - sale.paid_amount

    if sale.balance <= 0:

        sale.payment_status = "PAID"

    elif sale.paid_amount > 0:

        sale.payment_status = "PARTIAL"

    else:

        sale.payment_status = "UNPAID"

    sale.save()

    return sale
