from django.contrib import admin

from .models import (
    Sale,
    SaleItem,
    Extra,
    SaleItemExtra,
)

admin.site.register(Sale)
admin.site.register(SaleItem)
admin.site.register(Extra)
admin.site.register(SaleItemExtra)
