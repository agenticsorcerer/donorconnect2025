from django.db import models

class NotificationType(models.Model):
    notification_type_id = models.AutoField(primary_key=True)
    notification_type_key = models.CharField(max_length=30, null=True, blank=True)
    notification_type_display_display_name = models.CharField(max_length=40, null=True, blank=True)

    class Meta:
        db_table = 'notification_type'

    def __str__(self):
        return self.notification_type_display_display_name or self.notification_type_key or f"Notification Type {self.notification_type_id}"

