from rest_framework import serializers
from main.models.role import role

class roleSerializer(serializers.ModelSerializer):
    class Meta:
        model = role
        fields = '__all__'
 

