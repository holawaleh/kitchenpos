from django.urls import path

from .views import PaymentListView, RepaymentView

urlpatterns = [
    path("", PaymentListView.as_view()),
    path("repay/", RepaymentView.as_view()),
]
