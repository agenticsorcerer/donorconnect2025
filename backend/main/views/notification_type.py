from rest_framework import viewsets
from main.models.notification_type import NotificationType
from main.seriallizers.notification_type import NotificationTypeSerializer

class NotificationTypeView(viewsets.ModelViewSet):
    queryset = NotificationType.objects.all()
    serializer_class = NotificationTypeSerializer
    search_fields = '__all__'