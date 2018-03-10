# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import (
    viewsets,
    permissions
)

from django.contrib.auth.models import User
from django.db.models import Q

from .serializers import (
    UserValidateSerializer,
    UserCreateSerializer
)

# Create your views here.
class UserValidateView(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserValidateSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        qs = super(UserValidateView, self).get_queryset()

        username = self.request.query_params.get('username')

        if username:
            # Both email or username will do
            qs = qs.filter(Q(username=username) | Q(email=username))

        return qs

class UserCreateView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        qs = super(UserCreateView, self).get_queryset()

        return qs
