from django.db import models
from main.models.donation_request import DonationRequest
from main.models.notification_type import NotificationType
class Notification(models.Model):
    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('pending', 'Pending'),
    ]

    notification_id = models.AutoField(primary_key=True)
    donation_request = models.ForeignKey(
        DonationRequest,
        on_delete=models.CASCADE,
        db_column='donation_request_id',
        null=True,
        blank=True
    )
    notification_type_id= models.ForeignKey(
        NotificationType,
        on_delete=models.SET_NULL, # Or models.PROTECT, depending on your desired behavior if a NotificationType is deleted
        db_column='notification_type_id',
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'notifications'
        # verbose_name_plural = 'Notifications' # Optional

    def __str__(self):
        return f"Notification {self.notification_id} - Status: {self.status}"