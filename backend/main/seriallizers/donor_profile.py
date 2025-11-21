from rest_framework import serializers
from main.models.donor_profile import DonorProfile

class DonorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorProfile
        fields = '__all__'
        read_only_fields = ('donor_profile_id',)