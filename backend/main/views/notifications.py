from rest_framework import viewsets
from main.models.notifications import Notification
from main.seriallizers.notifications import NotificationsSerializer

class NotificationsView(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationsSerializer
    search_fields = '__all__'