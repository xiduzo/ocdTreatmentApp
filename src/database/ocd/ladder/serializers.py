from rest_framework import serializers

from .models import (
    ladderExercise
)

class ladderExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ladderExercise
        fields = (
            'url',
            'id',
            'situation',
            'fear_rating',
            'patient',
            'completed'
        )
