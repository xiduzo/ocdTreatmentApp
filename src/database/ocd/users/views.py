# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import (
    viewsets,
    permissions
)

from django.contrib.auth.models import User
from django.db.models import Q

from .serializers import (
    UserSerializer,
)

# Create your views here.
class UserView(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        qs = super(UserView, self).get_queryset()

        username = self.request.query_params.get('username')

        if username:
            # Both email or username will do
            qs = qs.filter(Q(username=username) | Q(email=username))

        return qs
