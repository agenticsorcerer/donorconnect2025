from rest_framework import serializers
from main.models.donation_type import DonationType

class DonationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationType
        fields = '__all__'
        read_only_fields = ('donation_type_id',)