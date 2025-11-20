from rest_framework import serializers
from main.models.user import User
from django.db import IntegrityError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    
    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError as e:
            if 'email' in str(e).lower():
                raise serializers.ValidationError({
                    'email': 'A user with this email already exists. Please use a different email or try logging in.'
                })
            raise serializers.ValidationError('An error occurred while creating the user.')
    
    def validate_email(self, value):
        """
        Check that the email is not already in use.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
 

