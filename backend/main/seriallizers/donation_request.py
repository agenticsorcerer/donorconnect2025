from rest_framework import serializers
from main.models.donation_request import DonationRequest

class DonationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationRequest
        fields = '__all__'
        read_only_fields = ('donation_requests_id', 'created_at')
