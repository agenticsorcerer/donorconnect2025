from rest_framework import serializers
from main.models.user import User
from main.models.role import role
from main.models.preferred_hospital import PreferredHospital
from django.db import IntegrityError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    
    def validate_role(self, value):
        """
        Validate that the role exists if provided
        Can accept either a role object or role_id (integer)
        """
        if value is not None:
            # If it's an integer (role_id), check if role exists
            if isinstance(value, int):
                if not role.objects.filter(role_id=value).exists():
                    raise serializers.ValidationError(f"Role with ID {value} does not exist.")
            # If it's a role object, it's already validated by DRF
            elif hasattr(value, 'role_id'):
                # It's already a role object, no need to validate
                pass
        return value
    
    def validate(self, data):
        """
        Validate the entire data object
        """
        # Check if role exists (if role_id is provided directly)
        role_id = data.get('role')
        if role_id is not None:
            # If role is an integer (ID), check if it exists
            if isinstance(role_id, int):
                if not role.objects.filter(role_id=role_id).exists():
                    raise serializers.ValidationError({
                        'role': f'Role with ID {role_id} does not exist. Please select a valid role.'
                    })
            # If role is a role object, it's already validated
        
        # Check if preferred hospital exists (if provided)
        hospital_id = data.get('prefered_hospital_id')
        if hospital_id is not None:
            if not PreferredHospital.objects.filter(preferred_hospital_id=hospital_id).exists():
                raise serializers.ValidationError({
                    'prefered_hospital_id': f'Hospital with ID {hospital_id} does not exist. Please select a valid hospital.'
                })
        
        return data
    
    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError as e:
            error_str = str(e).lower()
            if 'email' in error_str:
                raise serializers.ValidationError({
                    'email': 'A user with this email already exists. Please use a different email or try logging in.'
                })
            elif 'role' in error_str or 'role_id' in error_str:
                raise serializers.ValidationError({
                    'role': 'Invalid role selected. Please select a valid role.'
                })
            elif 'prefered_hospital_id' in error_str or 'hospital' in error_str:
                raise serializers.ValidationError({
                    'prefered_hospital_id': 'Invalid hospital selected. Please select a valid hospital.'
                })
            else:
                # Log the actual error for debugging
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f'Database integrity error: {str(e)}')
                raise serializers.ValidationError({
                    'non_field_errors': [f'Database error: {str(e)}']
                })
        except Exception as e:
            # Catch any other errors and show the actual error message
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f'Error creating user: {str(e)}', exc_info=True)
            raise serializers.ValidationError({
                'non_field_errors': [f'Error creating user: {str(e)}']
            })
    
    def validate_email(self, value):
        """
        Check that the email is not already in use.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_age(self, value):
        """
        Validate that age is at least 18
        """
        if value is not None and value < 18:
            raise serializers.ValidationError("You must be at least 18 years old to register.")
        return value
 

