from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from main.models.user import User
from main.seriallizers.user import UserSerializer
from django.db import IntegrityError

class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    search_fields = '__all__'
    
    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        """
        Custom registration endpoint with better error handling
        """
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response({
                    'success': True,
                    'message': 'User registered successfully!',
                    'user_id': user.user_id,
                    'email': user.email
                }, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                if 'email' in str(e).lower():
                    return Response({
                        'success': False,
                        'error': 'Email already exists',
                        'message': 'A user with this email already exists. Please use a different email or try logging in.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({
                        'success': False,
                        'error': 'Database error',
                        'message': 'An error occurred while creating the user.'
                    }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'success': False,
                'error': 'Validation error',
                'errors': serializer.errors,
                'message': 'Please check your input data.'
            }, status=status.HTTP_400_BAD_REQUEST)
     