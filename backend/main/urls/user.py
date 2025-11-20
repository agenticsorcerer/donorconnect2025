from django.urls import path, include
from rest_framework.routers import DefaultRouter
from main.views.user import UserView

router = DefaultRouter()
router.register(r'users', UserView, basename='user')

urlpatterns = [
    path('', include(router.urls)),
] 