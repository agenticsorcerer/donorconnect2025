from rest_framework import serializers
from main.models.user import User

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise serializers.ValidationError({
                'non_field_errors': ['Email and password are required.']
            })
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'non_field_errors': ['Invalid email or password.']
            })
        
        # Check if password matches (assuming plain text for now, you may want to use hashing)
        if user.password != password:
            raise serializers.ValidationError({
                'non_field_errors': ['Invalid email or password.']
            })
        
        # Check if user is active
        if not user.is_active:
            raise serializers.ValidationError({
                'non_field_errors': ['Your account is inactive. Please contact support.']
            })
        
        # Store user in validated_data for use in view
        data['user'] = user
        return data

