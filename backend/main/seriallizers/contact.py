from rest_framework import serializers

class ContactFormSerializer(serializers.Serializer):
    firstName = serializers.CharField(required=True, max_length=100)
    lastName = serializers.CharField(required=True, max_length=100)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=False, max_length=20, allow_blank=True)
    subject = serializers.ChoiceField(
        choices=[
            ('blood-donation', 'Blood Donation Inquiry'),
            ('volunteer', 'Volunteer Opportunities'),
            ('emergency', 'Emergency Assistance'),
            ('partnership', 'Partnership/Corporate'),
            ('general', 'General Inquiry'),
        ],
        required=True
    )
    message = serializers.CharField(required=True, max_length=2000)





