# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import (
    viewsets,
    permissions
)

from .models import (
    ladderExercise
)

from .serializers import (
    ladderExerciseSerializer
)

# Create your views here.
class ladderExerciseView(viewsets.ModelViewSet):
    queryset = ladderExercise.objects.all()
    serializer_class = ladderExerciseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = super(ladderExerciseView, self).get_queryset()

        patient = self.request.query_params.get('patient')

        if patient:
            qs = qs.filter(patient=patient)

        return qs
