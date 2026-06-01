from django.urls import path

from .views import (
    ProductListView,
    ProductDetailView,
    ProductBarcodeSearchView,
    POSProductListView,
)

urlpatterns = [
    path(
        "",
        ProductListView.as_view(),
    ),
    path(
        "barcode/",
        ProductBarcodeSearchView.as_view(),
    ),
    path(
        "<int:pk>/",
        ProductDetailView.as_view(),
    ),
    path("pos/", POSProductListView.as_view()),
]
