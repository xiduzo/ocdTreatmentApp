from rest_framework import serializers

from django.contrib.auth.models import User
from .models import Profile
from django.contrib.auth import get_user_model
# from django.db import models
# from django.contrib.auth.hashers import make_password

class UserValidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'username',
            'profile'
        )

class UserCreateSerializer(serializers.ModelSerializer):
    # Be sure no-one can see the password
    password = serializers.CharField(write_only=True)
    email = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = get_user_model().objects.create(
            username = validated_data['username']
        )

        user.set_password(validated_data['password'])
        user.save()
        return user

    # Bc you can also login with your email
    def validate_email(self, value):
        norm_email = value.lower()
        if User.objects.filter(email=norm_email).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return norm_email

    class Meta:
        model = User
        fields = (
            'url',
            'username',
            'password',
            'email'
        )
