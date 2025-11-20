from rest_framework import viewsets
from main.models.role import role
from main.seriallizers.role import roleSerializer

class roleView(viewsets.ModelViewSet):
    queryset = role.objects.all()
    serializer_class = roleSerializer
    search_fields = '__all__'
     