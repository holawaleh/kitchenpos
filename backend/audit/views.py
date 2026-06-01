from rest_framework.generics import (
    ListAPIView,
)

from django.db import models

from rest_framework.permissions import (
    AllowAny,
)

from .models import AuditLog

from .serializers import (
    AuditLogSerializer,
)


class AuditLogListView(ListAPIView):

    permission_classes = [AllowAny]

    serializer_class = AuditLogSerializer

    def get_queryset(self):

        queryset = AuditLog.objects.select_related("user").order_by("-created_at")

        search = self.request.query_params.get("search")

        action = self.request.query_params.get("action")

        if search:

            queryset = queryset.filter(
                models.Q(description__icontains=search)
                | models.Q(user__full_name__icontains=search)
                | models.Q(user__username__icontains=search)
                | models.Q(target_type__icontains=search)
            )

            if search.isdigit():

                queryset = queryset | AuditLog.objects.select_related("user").filter(
                    target_id=int(search)
                )

        if action:

            queryset = queryset.filter(action=action)

        return queryset
