from django.urls import path

from .views import (
    LoginView,
    StaffCreateView,
    StaffListView,
    StaffDetailView,
    ChangePasswordView,
)

urlpatterns = [
    path(
        "login/",
        LoginView.as_view(),
    ),
    path(
        "staff/",
        StaffListView.as_view(),
    ),
    path(
        "staff/create/",
        StaffCreateView.as_view(),
    ),
    path(
        "staff/<int:pk>/",
        StaffDetailView.as_view(),
    ),
    path(
        "change-password/",
        ChangePasswordView.as_view(),
    ),
]
