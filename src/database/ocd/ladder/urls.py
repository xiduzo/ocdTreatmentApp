from rest_framework import routers

from .views import (
    ladderExerciseView
)

router = routers.DefaultRouter()

router.register(r'exercise', ladderExerciseView)

urlpatterns = router.urls
