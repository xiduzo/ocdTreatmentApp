from rest_framework import serializers

from .models import (
    ladderLevel,
    ladderLevelExercise
)

class ladderLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ladderLevel
        fields = (
            'url',
            'id',
            'situation',
            'fear_rating'
        )

class ladderLevelExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ladderLevelExercise
        fields = (
            'url',
            'id',
            'completed',
            'time'
        )
