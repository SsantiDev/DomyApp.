from django.db import models
from django.conf import settings

class Message(models.Model):
    service_request = models.ForeignKey(
        'services.ServiceRequest',
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    is_support_chat = models.BooleanField(
        default=False, 
        help_text="True si es chat de soporte técnico (Admin), False si es coordinación (Cliente/Op)"
    )
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Msg from {self.sender.email} at {self.created_at}"
