from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from main.seriallizers.contact import ContactFormSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def contact_form_view(request):
    """
    Handle contact form submissions and send email notifications.
    """
    serializer = ContactFormSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': 'Validation error',
            'errors': serializer.errors,
            'message': 'Please check your input data.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        data = serializer.validated_data
        first_name = data['firstName']
        last_name = data['lastName']
        user_email = data['email']
        phone = data.get('phone', 'Not provided')
        subject_type = data['subject']
        message = data['message']
        
        # Get recipient email from settings (your email)
        recipient_email = getattr(settings, 'CONTACT_EMAIL', settings.DEFAULT_FROM_EMAIL)
        
        # Professional sender name
        from_email_display = f"Donor Connect <{settings.DEFAULT_FROM_EMAIL}>"
        
        # Subject mapping
        subject_map = {
            'blood-donation': 'Blood Donation Inquiry',
            'volunteer': 'Volunteer Opportunities',
            'emergency': 'Emergency Assistance',
            'partnership': 'Partnership/Corporate',
            'general': 'General Inquiry',
        }
        email_subject = f"Contact Form: {subject_map.get(subject_type, 'General Inquiry')}"
        
        # Create email body
        email_body = f"""
New Contact Form Submission

Name: {first_name} {last_name}
Email: {user_email}
Phone: {phone}
Subject: {subject_map.get(subject_type, 'General Inquiry')}

Message:
{message}

---
This email was sent from the Donor Connect contact form.
        """.strip()
        
        # Send email
        try:
            send_mail(
                subject=email_subject,
                message=email_body,
                from_email=from_email_display,
                recipient_list=[recipient_email],
                fail_silently=False,
            )
            
            # Also send a confirmation email to the user
            confirmation_subject = "Thank you for contacting Donor Connect"
            confirmation_body = f"""
Dear {first_name} {last_name},

Thank you for contacting Donor Connect. We have received your message regarding "{subject_map.get(subject_type, 'General Inquiry')}".

We will review your inquiry and get back to you within 24 hours.

Your message:
{message}

Best regards,
Donor Connect Team
            """.strip()
            
            send_mail(
                subject=confirmation_subject,
                message=confirmation_body,
                from_email=from_email_display,
                recipient_list=[user_email],
                fail_silently=False,
            )
            
            return Response({
                'success': True,
                'message': 'Thank you for your message! We will get back to you within 24 hours. A confirmation email has been sent to your email address.'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f'Error sending email: {str(e)}')
            return Response({
                'success': False,
                'error': 'Email sending failed',
                'message': f'There was an error sending your message. Please try again later or contact us directly. Error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        logger.error(f'Unexpected error in contact form: {str(e)}')
        return Response({
            'success': False,
            'error': 'Server error',
            'message': 'An unexpected error occurred. Please try again later.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

