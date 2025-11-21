from django.db.models import Q
from main.models.donor_profile import DonorProfile

class DonorProfileFilter:
    """
    Filter class for DonorProfile model
    Supports filtering by city, blood_group, preferred_hospital_id, and availability
    """
    
    @staticmethod
    def filter_queryset(queryset, request):
        """
        Apply filters to queryset based on request query parameters
        
        Args:
            queryset: DonorProfile queryset
            request: Django request object with query parameters
            
        Returns:
            Filtered queryset
        """
        # Get filter parameters from request
        city = request.query_params.get('city', '').strip()
        blood_group = request.query_params.get('blood_group', '').strip()
        preferred_hospital_id = request.query_params.get('preferred_hospital_id', '').strip()
        availability = request.query_params.get('availability', 'true').strip().lower()
        
        # Build filter conditions
        filter_conditions = Q()
        
        # Filter by city (case-insensitive partial match)
        if city:
            filter_conditions &= Q(city__icontains=city)
        
        # Filter by blood group (exact match)
        if blood_group:
            if blood_group in [choice[0] for choice in DonorProfile.BLOOD_GROUP_CHOICES]:
                filter_conditions &= Q(blood_group=blood_group)
        
        # Filter by preferred hospital ID
        if preferred_hospital_id:
            try:
                hospital_id = int(preferred_hospital_id)
                filter_conditions &= Q(preferred_hospital_id=hospital_id)
            except (ValueError, TypeError):
                pass
        
        # Filter by availability (default to True if not specified)
        if availability == 'true':
            filter_conditions &= Q(availability=True)
        elif availability == 'false':
            filter_conditions &= Q(availability=False)
        
        # Apply all filters
        if filter_conditions:
            queryset = queryset.filter(filter_conditions)
        
        return queryset

