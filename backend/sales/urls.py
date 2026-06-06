from django.urls import path

from .views import (
    SaleCreateView,
    SaleListView,
    SaleDetailView,
    ReceiptView,
    MarkReceiptPrintedView,
)

urlpatterns = [
    path("", SaleListView.as_view()),
    path("checkout/", SaleCreateView.as_view()),
    path("<int:pk>/", SaleDetailView.as_view()),
    path("<int:pk>/receipt/", ReceiptView.as_view()),
    path("<int:pk>/mark-receipt-printed/", MarkReceiptPrintedView.as_view()),
]
