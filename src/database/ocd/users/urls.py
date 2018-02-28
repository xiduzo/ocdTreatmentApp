from rest_framework import routers

from .views import (
    UserView,
)

router = routers.DefaultRouter()

router.register(r'user', UserView)

urlpatterns = router.urls
