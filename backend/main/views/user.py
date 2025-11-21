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
    
    def create(self, request, *args, **kwargs):
        """
        Create a new user - handles POST /api/users/
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
            except Exception as e:
                # The serializer's create method should handle most errors
                # But catch any unexpected errors here
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f'Unexpected error in user creation: {str(e)}')
                return Response({
                    'success': False,
                    'error': 'Unexpected error',
                    'message': f'An unexpected error occurred: {str(e)}',
                    'errors': {'non_field_errors': [str(e)]}
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'success': False,
                'error': 'Validation error',
                'errors': serializer.errors,
                'message': 'Please check your input data.'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        """
        Custom registration endpoint with better error handling
        Alias for create method
        """
        return self.create(request)
     