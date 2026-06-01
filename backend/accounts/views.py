from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from common.permissions import IsSuperAdmin

from .models import User

from .serializers import (
    UserSerializer,
    StaffCreateSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
)


class LoginView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            data = serializer.validated_data

            return Response(
                {
                    "success": True,
                    "message": "Login successful",
                    "data": {
                        "user": UserSerializer(data["user"]).data,
                        "access": data["access"],
                        "refresh": data["refresh"],
                        "must_change_password": data["must_change_password"],
                    },
                }
            )

        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class StaffCreateView(APIView):

    permission_classes = [IsSuperAdmin]

    def post(self, request):

        serializer = StaffCreateSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Staff created successfully",
                    "data": {
                        "user": UserSerializer(user).data,
                        "temporary_password": user.generated_password,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class StaffListView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        staff = User.objects.filter(is_active=True).order_by("-created_at")

        serializer = UserSerializer(staff, many=True)

        return Response({"success": True, "data": serializer.data})


class StaffDetailView(APIView):

    permission_classes = [IsSuperAdmin]

    def delete(self, request, pk):

        try:

            user = User.objects.get(pk=pk, is_active=True)

        except User.DoesNotExist:

            return Response(
                {"success": False, "message": "Staff not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if user.id == request.user.id:

            return Response(
                {"success": False, "message": "You cannot delete your own account"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = False

        user.save(update_fields=["is_active", "updated_at"])

        return Response({"success": True, "message": "Staff deleted successfully"})


class ChangePasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        if not request.user.is_authenticated:
            return Response(
                {
                    "success": True,
                    "message": "Password changes are disabled in public access mode",
                }
            )

        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():

            user = request.user

            old_password = serializer.validated_data["old_password"]

            new_password = serializer.validated_data["new_password"]

            if not user.check_password(old_password):

                return Response(
                    {"success": False, "message": "Old password incorrect"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.set_password(new_password)

            user.must_change_password = False

            user.temporary_password_expiry = None

            user.save()

            return Response(
                {"success": True, "message": "Password changed successfully"}
            )

        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
