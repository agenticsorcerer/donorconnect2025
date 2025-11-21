from rest_framework import serializers
from main.models.notifications import Notification

class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('notification_id',) 