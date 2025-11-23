from rest_framework import serializers

class DonateFormSerializer(serializers.Serializer):
    bloodGroup = serializers.CharField(required=True, max_length=10)
    firstName = serializers.CharField(required=True, max_length=100)
    lastName = serializers.CharField(required=True, max_length=100)
    email = serializers.EmailField(required=True)
    address = serializers.CharField(required=True, max_length=200)
    caseDescription = serializers.CharField(required=True, max_length=2000)




