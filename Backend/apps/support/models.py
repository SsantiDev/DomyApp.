from django.db import models
from django.conf import settings

class Incident(models.Model):
    class Type(models.TextChoices):
        NO_SHOW = 'NO_SHOW', 'Inasistencia'
        DELAY = 'DELAY', 'Retraso'
        QUALITY = 'QUALITY', 'Calidad del servicio'
        SAFETY = 'SAFETY', 'Seguridad'
        OTHER = 'OTHER', 'Otro'

    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Abierto'
        IN_REVIEW = 'IN_REVIEW', 'En revisión'
        ESCALATED = 'ESCALATED', 'Escalado'
        RESOLVED = 'RESOLVED', 'Resuelto'
        DISMISSED = 'DISMISSED', 'Desestimado'

    service_request = models.ForeignKey(
        'services.ServiceRequest',
        on_delete=models.CASCADE,
        related_name='incidents'
    )
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reported_incidents'
    )
    incident_type = models.CharField(
        max_length=20,
        choices=Type.choices,
        default=Type.OTHER
    )
    description = models.TextField()
    needs_refund = models.BooleanField(default=False)
    escalation_note = models.TextField(blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.incident_type} - {self.service_request.id}"
