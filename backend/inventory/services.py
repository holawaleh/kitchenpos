from decimal import Decimal

from django.db import transaction

from .models import (
    StockItem,
    StockMovement,
)


@transaction.atomic
def add_stock(product, quantity, performed_by, note=""):

    stock_item, created = StockItem.objects.get_or_create(
        product=product, defaults={"quantity": Decimal("0.00")}
    )

    stock_item = StockItem.objects.select_for_update().get(pk=stock_item.pk)

    quantity = Decimal(quantity)

    stock_item.quantity += quantity

    stock_item.save(update_fields=["quantity", "updated_at"])

    StockMovement.objects.create(
        product=product,
        movement_type="IN",
        quantity=quantity,
        performed_by=performed_by,
        note=note,
    )

    return stock_item


@transaction.atomic
def deduct_stock(product, quantity, performed_by, note=""):

    stock_item, created = StockItem.objects.get_or_create(
        product=product, defaults={"quantity": Decimal("0.00")}
    )

    stock_item = StockItem.objects.select_for_update().get(pk=stock_item.pk)

    quantity = Decimal(quantity)

    if stock_item.quantity < quantity:

        raise ValueError(f"Insufficient stock for " f"{product.name}")

    stock_item.quantity -= quantity

    stock_item.save(update_fields=["quantity", "updated_at"])

    StockMovement.objects.create(
        product=product,
        movement_type="OUT",
        quantity=quantity,
        performed_by=performed_by,
        note=note,
    )

    return stock_item
