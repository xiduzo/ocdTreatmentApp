# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import ladderLevel, ladderLevelExercise

# Register your models here.
admin.site.register(ladderLevel)
admin.site.register(ladderLevelExercise)
