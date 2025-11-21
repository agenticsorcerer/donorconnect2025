from rest_framework import serializers
from main.models.notification_type import NotificationType

class NotificationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationType
        fields = '__all__'
        read_only_fields = ('notification_type_id',)