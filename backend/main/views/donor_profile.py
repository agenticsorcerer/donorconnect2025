from rest_framework import viewsets
from main.models.donor_profile import DonorProfile
from main.seriallizers.donor_profile import DonorProfileSerializer

class DonorProfileView(viewsets.ModelViewSet):
    queryset = DonorProfile.objects.all()
    serializer_class = DonorProfileSerializer
    search_fields = '__all__'