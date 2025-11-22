from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from main.seriallizers.donate import DonateFormSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def donate_form_view(request):
    """
    Handle donation form submissions and send email notifications.
    """
    serializer = DonateFormSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'error': 'Validation error',
            'errors': serializer.errors,
            'message': 'Please check your input data.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        data = serializer.validated_data
        blood_group = data['bloodGroup']
        first_name = data['firstName']
        last_name = data['lastName']
        user_email = data['email']
        address = data['address']
        case_description = data['caseDescription']
        
        # Get recipient email from settings (your email)
        recipient_email = getattr(settings, 'CONTACT_EMAIL', settings.DEFAULT_FROM_EMAIL)
        
        # Professional sender name for confirmation email
        from_email_display = f"Donor Connect <{settings.DEFAULT_FROM_EMAIL}>"
        
        # Email subject
        email_subject = f"New Blood Donation Request - {blood_group}"
        
        # Create email body for admin
        email_body = f"""
New Blood Donation Request

Donor Information:
Name: {first_name} {last_name}
Email: {user_email}
Address: {address}
Blood Group: {blood_group}

Case Description:
{case_description}

---
This email was sent from the Donor Connect donation form.
You can reply directly to this email to contact the donor.
        """.strip()
        
        # Send email to admin - appears to come from donor's email
        try:
            # Use EmailMessage to set custom headers
            # Note: We use the donor's email in From field, but authentication uses system email
            # If this fails due to SPF/DKIM, we'll fall back to system email with Reply-To
            try:
                email = EmailMessage(
                    subject=email_subject,
                    body=email_body,
                    from_email=f"{first_name} {last_name} <{user_email}>",  # Appears from donor
                    to=[recipient_email],
                    reply_to=[user_email],  # Reply goes to donor
                )
                email.send(fail_silently=False)
            except Exception as email_error:
                # Fallback: Use system email but with Reply-To set to donor
                logger.warning(f'Failed to send from donor email, using fallback: {str(email_error)}')
                email = EmailMessage(
                    subject=email_subject,
                    body=email_body,
                    from_email=f"{first_name} {last_name} (via Donor Connect) <{settings.DEFAULT_FROM_EMAIL}>",
                    to=[recipient_email],
                    reply_to=[user_email],  # Reply goes to donor
                )
                email.send(fail_silently=False)
            
            # Also send a confirmation email to the donor
            confirmation_subject = "Thank you for your Blood Donation Request - Donor Connect"
            confirmation_body = f"""
Dear {first_name} {last_name},

Thank you for your generous intention to donate blood! We have received your donation request for blood group {blood_group}.

Your donation can save lives! Our team will review your request and contact you soon to coordinate the donation process.

Your Details:
- Blood Group: {blood_group}
- Address: {address}
- Case Description: {case_description}

We appreciate your willingness to help save lives. Your contribution makes a real difference in our community.

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
                'message': 'Thank you for your donation request! We will contact you soon. A confirmation email has been sent to your email address.'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f'Error sending email: {str(e)}')
            return Response({
                'success': False,
                'error': 'Email sending failed',
                'message': f'There was an error sending your donation request. Please try again later or contact us directly. Error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        logger.error(f'Unexpected error in donation form: {str(e)}')
        return Response({
            'success': False,
            'error': 'Server error',
            'message': 'An unexpected error occurred. Please try again later.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

