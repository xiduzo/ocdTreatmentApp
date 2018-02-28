from rest_framework import routers

from .views import (
    ladderLevelView,
    ladderLevelExerciseView
)

router = routers.DefaultRouter()

router.register(r'level', ladderLevelView)
router.register(r'levelExercise', ladderLevelExerciseView)

urlpatterns = router.urls
