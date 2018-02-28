# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import (
    viewsets,
    permissions
)

from .models import (
    ladderLevel,
    ladderLevelExercise
)

from .serializers import (
    ladderLevelSerializer,
    ladderLevelExerciseSerializer
)

# Create your views here.
class ladderLevelView(viewsets.ModelViewSet):
    queryset = ladderLevel.objects.all()
    serializer_class = ladderLevelSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = super(ladderLevelView, self).get_queryset()

        return qs

class ladderLevelExerciseView(viewsets.ModelViewSet):
    queryset = ladderLevelExercise.objects.all()
    serializer_class = ladderLevelExerciseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = super(ladderLevelExerciseView, self).get_queryset()

        return qs
