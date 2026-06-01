from datetime import timedelta
import secrets

from django.contrib.auth import authenticate
from django.utils import timezone

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "full_name",
            "username",
            "role",
            "phone_number",
            "is_active",
            "created_at",
        ]


class StaffCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "full_name",
            "username",
            "role",
            "phone_number",
        ]

    def create(self, validated_data):

        temporary_password = secrets.token_hex(4)

        expiry_time = timezone.now() + timedelta(hours=24)

        user = User(
            **validated_data,
            temporary_password_expiry=expiry_time,
            must_change_password=True,
        )

        user.set_password(temporary_password)

        user.save()

        user.generated_password = temporary_password

        return user


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()

    password = serializers.CharField(write_only=True)

    def validate(self, attrs):

        username = attrs.get("username")

        password = attrs.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("Account disabled")

        if (
            user.temporary_password_expiry
            and timezone.now() > user.temporary_password_expiry
        ):
            raise serializers.ValidationError("Temporary password expired")

        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "must_change_password": user.must_change_password,
        }


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField()

    new_password = serializers.CharField()

    def validate_new_password(self, value):

        if len(value) < 6:

            raise serializers.ValidationError("Password must be at least 6 characters")

        return value
