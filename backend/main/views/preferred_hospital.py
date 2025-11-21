from rest_framework import viewsets
from main.models.preferred_hospital import PreferredHospital
from main.seriallizers.preferred_hospital import PreferredHospitalSerializer

class PreferredHospitalView(viewsets.ModelViewSet):
    queryset = PreferredHospital.objects.all()
    serializer_class = PreferredHospitalSerializer
    search_fields = '__all__'