from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class ServiceRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pendiente'
        ACCEPTED = 'ACCEPTED', 'Aceptado'
        IN_PROGRESS = 'IN_PROGRESS', 'En Proceso'
        COMPLETED = 'COMPLETED', 'Completado'
        CANCELLED = 'CANCELLED', 'Cancelado'

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='service_requests_as_client'
    )
    worker = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='service_requests_as_worker'
    )
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    scheduled_at = models.DateTimeField()
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    details = models.TextField(blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_billed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_billed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.category.name} - {self.client.email} ({self.status})"

class Review(models.Model):
    service_request = models.OneToOneField(
        ServiceRequest, 
        on_delete=models.CASCADE, 
        related_name='review'
    )
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.service_request.id} - Rating: {self.rating}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Actualizar average_rating del worker
        worker = self.service_request.worker
        if worker and hasattr(worker, 'worker_info'):
            from django.db.models import Avg
            avg = Review.objects.filter(service_request__worker=worker).aggregate(Avg('rating'))['rating__avg']
            if avg is not None:
                worker.worker_info.average_rating = round(avg, 1)
                worker.worker_info.save()

class ServiceRequestNotification(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pendiente'
        ACCEPTED = 'ACCEPTED', 'Aceptada'
        REJECTED = 'REJECTED', 'Rechazada'
        CANCELLED = 'CANCELLED', 'Cancelada' # For when someone else takes the job

    service_request = models.ForeignKey(
        ServiceRequest,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    worker = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='service_notifications'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notif para {self.worker.email} - S.R. {self.service_request.id} ({self.status})"
