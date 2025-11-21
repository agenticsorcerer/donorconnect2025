from django.db import models
from main.models.user import User
from main.models.donation_type import DonationType
from main.models.preferred_hospital import PreferredHospital
class DonorProfile(models.Model):
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
    ]

    donro_profile_id = models.AutoField(primary_key=True, db_column='donro_profile_id')
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        db_column='user_id'
    )
    blood_group = models.CharField(
        max_length=3,
        choices=BLOOD_GROUP_CHOICES
    )
    city = models.CharField(max_length=50)
    preferred_hospital = models.ForeignKey(
        PreferredHospital,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='preferred_hospital_id'
    )
    availability = models.BooleanField(default=True)
    donation_type = models.ForeignKey(
        DonationType,
        on_delete=models.CASCADE,
        db_column='donation_type_id'
    )
    donation_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'donor_profiles'

    def __str__(self):
        return f"Donor Profile {self.donro_profile_id} - {self.blood_group}"

