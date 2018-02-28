from django.contrib import admin
from django.conf.urls import (
    url,
    include
)
from rest_framework_jwt.views import (
    obtain_jwt_token,
    refresh_jwt_token,
    verify_jwt_token
)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^ladders/', include('ladder.urls')),
    url(r'^users/', include('users.urls')),
    url(r'^api-auth/', include('rest_framework.urls')),
    url(r'^jwt-token-auth/', obtain_jwt_token),
    url(r'^jwt-token-refresh/', refresh_jwt_token),
    url(r'^jwt-token-verify/', verify_jwt_token)
]
