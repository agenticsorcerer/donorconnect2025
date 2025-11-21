from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from main.models.donor_profile import DonorProfile
from main.seriallizers.donor_profile import DonorProfileSerializer
from main.filters.donor_profile import DonorProfileFilter

class DonorProfileView(viewsets.ModelViewSet):
    queryset = DonorProfile.objects.all()
    serializer_class = DonorProfileSerializer
    search_fields = '__all__'
    
    def get_queryset(self):
        """
        Get queryset with related data for better performance
        """
        queryset = DonorProfile.objects.select_related(
            'user', 
            'preferred_hospital', 
            'donation_type'
        ).all()
        
        # Apply filters using DonorProfileFilter
        queryset = DonorProfileFilter.filter_queryset(queryset, self.request)
        
        return queryset
    
    @action(detail=False, methods=['get'], url_path='search')
    def search_donors(self, request):
        """
        Search donors by city, blood_group, and preferred_hospital
        Uses DonorProfileFilter for filtering
        GET /api/donor-profiles/search/?city=Karachi&blood_group=O+&preferred_hospital_id=1
        """
        # Get filtered queryset
        queryset = self.get_queryset()
        
        # Serialize results
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'count': queryset.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)