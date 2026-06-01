USER_ROLES = (
    ("SUPERADMIN", "Super Admin"),
    ("MANAGER", "Manager"),
    ("CASHIER", "Cashier"),
    ("INVENTORY", "Inventory"),
)


PRODUCT_STATUS = (
    ("AVAILABLE", "Available"),
    ("FINISHED", "Finished"),
)


PRODUCT_TYPES = (
    ("COUNTABLE", "Countable"),
    ("FLEXIBLE", "Flexible"),
)


PAYMENT_STATUS = (
    ("PAID", "Paid"),
    ("PARTIAL", "Partial"),
    ("UNPAID", "Unpaid"),
)


STOCK_MOVEMENT_TYPES = (
    ("IN", "Stock In"),
    ("OUT", "Stock Out"),
)


PAYMENT_METHODS = (
    ("CASH", "Cash"),
    ("TRANSFER", "Transfer"),
    ("CARD", "Card"),
    ("MIXED", "Mixed"),
)
