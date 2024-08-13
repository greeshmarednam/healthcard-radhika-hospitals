from django.urls import path, include

urlpatterns = [
    path('users/', include('api.users_urls')),
    path('admin/', include('api.admin_urls'))
]
