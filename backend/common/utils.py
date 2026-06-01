from decimal import Decimal

from django.utils import timezone


def format_currency(amount):

    return f"₦{amount:,.2f}"


def generate_daily_reference(prefix="REF"):

    today = timezone.now().strftime("%Y%m%d")

    timestamp = timezone.now().strftime("%H%M%S")

    return f"{prefix}-{today}-{timestamp}"


def calculate_percentage(part, whole):

    if whole == 0:
        return Decimal("0.00")

    return (part / whole) * 100
