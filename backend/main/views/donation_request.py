from rest_framework import viewsets
from main.models.donation_request import DonationRequest
from main.seriallizers.donation_request import DonationRequestSerializer

class DonationRequestView(viewsets.ModelViewSet):
    queryset = DonationRequest.objects.all()
    serializer_class = DonationRequestSerializer
    search_fields = '__all__'