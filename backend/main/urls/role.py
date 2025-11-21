from django.urls import path, include
from rest_framework.routers import DefaultRouter
from main.views.role import roleView

router = DefaultRouter()
router.register(r'', roleView, basename='role')

urlpatterns = [
    path('', include(router.urls)),
] 