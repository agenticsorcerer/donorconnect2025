from rest_framework import serializers
from main.models.preferred_hospital import PreferredHospital

class PreferredHospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreferredHospital
        fields = '__all__'
        read_only_fields = ('preferred_hospital_id',)