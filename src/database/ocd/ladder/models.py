# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from lib.models import UUIDModel

from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class ladderLevel(UUIDModel):
    situation = models.CharField(max_length=99999)
    fear_rating = models.PositiveSmallIntegerField()
    patient = models.ForeignKey(User, null=True)

    def __str__(self):
        return '\'{}\' for {}'.format(
            self.situation,
            self.patient.username
        )

class ladderLevelExercise(UUIDModel):
    completed = models.BooleanField(default=False)
    time = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(600)])

    ladder = models.ForeignKey('ladder.ladderLevel', null=True)
