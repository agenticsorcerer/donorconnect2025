from django.db import models

class DonationType(models.Model):
    donation_type_id = models.AutoField(primary_key=True)
    donation_type_key = models.CharField(max_length=20, null=True, blank=True)
    donation_type_display_name = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'donation_type'

    def __str__(self):
        return self.donation_type_display_name