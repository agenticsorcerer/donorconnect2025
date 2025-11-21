from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from main.seriallizers.login import LoginSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login endpoint - validates email and password, checks if user is active
    POST /api/login/
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Return user data (excluding password)
        return Response({
            'success': True,
            'message': 'Login successful!',
            'user': {
                'user_id': user.user_id,
                'email': user.email,
                'frist_name': user.frist_name,
                'last_name': user.last_name,
                'phone_number': user.phone_number,
                'age': user.age,
                'gender': user.gender,
                'role_id': user.role.role_id if user.role else None,
                'role_name': user.role.role_display_name if user.role else None,
                'is_active': user.is_active,
                'avatar_url': user.avatar_url.url if user.avatar_url else None,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'success': False,
            'error': 'Login failed',
            'errors': serializer.errors,
            'message': serializer.errors.get('non_field_errors', ['Invalid credentials.'])[0] if serializer.errors.get('non_field_errors') else 'Please check your email and password.'
        }, status=status.HTTP_401_UNAUTHORIZED)

