from rest_framework.routers import DefaultRouter
from django.urls import path, include
from main.views.notifications import NotificationsView

router = DefaultRouter()
router.register(r'notifications', NotificationsView, basename='notifications')

urlpatterns = [
    path('', include(router.urls)),
]