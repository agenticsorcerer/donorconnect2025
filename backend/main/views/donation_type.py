from rest_framework import viewsets
from main.models.donation_type import DonationType
from main.seriallizers.donation_type import DonationTypeSerializer

class DonationTypeView(viewsets.ModelViewSet):
    queryset = DonationType.objects.all()
    serializer_class = DonationTypeSerializer
    search_fields = '__all__'