from django.urls import path

from .views import (
    StockItemListView,
    StockMovementListView,
    AddStockView,
    DeductStockView,
    LowStockListView,
)

urlpatterns = [
    path("", StockItemListView.as_view()),
    path("movements/", StockMovementListView.as_view()),
    path("low-stock/", LowStockListView.as_view()),
    path("add-stock/", AddStockView.as_view()),
    path("deduct-stock/", DeductStockView.as_view()),
]
