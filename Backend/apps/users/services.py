import logging
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import User

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_welcome_email(user: User):
        """
        Sends a welcome email to the user (Client or Worker)
        """
        try:
            subject = '¡Bienvenido a Domy!'
            
            # Choose template based on role
            if user.role == User.Role.WORKER:
                template_name = 'users/emails/welcome_worker.html'
            else:
                template_name = 'users/emails/welcome_client.html'
            
            context = {
                'user': user,
                'first_name': user.first_name or user.username,
            }
            
            html_content = render_to_string(template_name, context)
            text_content = strip_tags(html_content)
            
            msg = EmailMultiAlternatives(
                subject,
                text_content,
                settings.DEFAULT_FROM_EMAIL,
                [user.email]
            )
            msg.attach_alternative(html_content, "text/html")
            
            # Send (silently to avoid hanging the signal if SMTP fails in prod)
            msg.send(fail_silently=True)
            logger.info(f"Welcome email sent successfully to {user.email}")
            
        except Exception as e:
            logger.error(f"Error sending welcome email to {user.email}: {str(e)}")
