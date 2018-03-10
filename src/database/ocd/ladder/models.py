# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from lib.models import UUIDModel

from django.contrib.auth.models import User
from users.models import Profile
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class ladderExercise(UUIDModel):
    FEAR_RATINGS = [
        (1,1),
        (2,2),
        (3,3),
        (4,4),
        (5,5),
        (6,6),
        (7,7),
        (8,8),
    ]
    situation = models.TextField(max_length=99999)
    fear_rating = models.PositiveSmallIntegerField(choices=FEAR_RATINGS, default=1)
    patient = models.ForeignKey(Profile, null=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return '\'{}\' for {} ({})'.format(
            self.situation,
            self.patient.username,
            self.fear_rating
        )
