from rest_framework import serializers
from main.models.donor_profile import DonorProfile

class DonorProfileSerializer(serializers.ModelSerializer):
    # Include user information
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    user_age = serializers.IntegerField(source='user.age', read_only=True)
    user_gender = serializers.CharField(source='user.gender', read_only=True)
    user_avatar = serializers.SerializerMethodField()
    
    # Include hospital information
    hospital_name = serializers.SerializerMethodField()
    
    # Include donation type information
    donation_type_name = serializers.SerializerMethodField()
    
    class Meta:
        model = DonorProfile
        fields = '__all__'
        read_only_fields = ('donor_profile_id',)
    
    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.frist_name} {obj.user.last_name}"
        return None
    
    def get_user_avatar(self, obj):
        if obj.user and obj.user.avatar_url:
            return obj.user.avatar_url.url
        return None
    
    def get_hospital_name(self, obj):
        if obj.preferred_hospital:
            return f"{obj.preferred_hospital.hospital_name} - {obj.preferred_hospital.city_name}" if obj.preferred_hospital.city_name else obj.preferred_hospital.hospital_name
        return None
    
    def get_donation_type_name(self, obj):
        if obj.donation_type:
            return obj.donation_type.donation_type_display_name or obj.donation_type.donation_type_key
        return None