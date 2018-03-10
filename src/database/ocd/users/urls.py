from rest_framework import routers

from .views import (
    UserValidateView,
    UserCreateView,
)

router = routers.DefaultRouter()

router.register(r'validate', UserValidateView, base_name='validate')
router.register(r'create', UserCreateView)

urlpatterns = router.urls
