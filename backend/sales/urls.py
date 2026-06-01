from django.urls import path

from .views import (
    SaleCreateView,
    SaleListView,
    SaleDetailView,
    ReceiptView,
)

urlpatterns = [
    path("", SaleListView.as_view()),
    path("checkout/", SaleCreateView.as_view()),
    path("<int:pk>/", SaleDetailView.as_view()),
    path("<int:pk>/receipt/", ReceiptView.as_view()),
]
