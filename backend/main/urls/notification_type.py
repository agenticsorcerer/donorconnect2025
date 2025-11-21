from rest_framework.routers import DefaultRouter
from django.urls import path, include
from main.views.notification_type import NotificationTypeView

router = DefaultRouter()
router.register(r'notification-types', NotificationTypeView, basename='notification-type')

urlpatterns = [
    path('', include(router.urls)),
]