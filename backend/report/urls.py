from django.urls import path

from .views import (
    DashboardSummaryView,
    DailySalesReportView,
    RevenueSummaryView,
    PaymentSummaryView,
    DebtSummaryView,
    TopProductsView,
)

urlpatterns = [
    path("dashboard-summary/", DashboardSummaryView.as_view()),
    path("daily-sales/", DailySalesReportView.as_view()),
    path("revenue-summary/", RevenueSummaryView.as_view()),
    path("payment-summary/", PaymentSummaryView.as_view()),
    path("debt-summary/", DebtSummaryView.as_view()),
    path("top-products/", TopProductsView.as_view()),
]
