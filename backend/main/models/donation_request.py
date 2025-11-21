from django.db import models
from main.models.user import User

class DonationRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
    ]

    CONTACT_METHOD_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('whatsapp', 'WhatsApp'),
    ]

    donation_requests_id = models.AutoField(primary_key=True)
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_requests',
        null=True,
        blank=True,
        db_column='recipient_id'
    )
    donor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='donation_requests',
        null=True,
        blank=True,
        db_column='donor_id'
    )
    message = models.TextField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    contact_method = models.CharField(
        max_length=20,
        choices=CONTACT_METHOD_CHOICES,
        default='email'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'donation_requests'

    def __str__(self):
        return f"Donation Request {self.donation_requests_id}"
