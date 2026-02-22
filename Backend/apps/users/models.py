from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        CLIENT = 'CLIENT', 'Client'
        WORKER = 'WORKER', 'Worker'

    email = models.EmailField(unique=True, blank=False, null=False)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CLIENT,
        db_index=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.role})"

class WorkerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='worker_profile')
    identity_document = models.CharField(max_length=64, unique=True)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    average_rating = models.FloatField(default=0.0)

    def __str__(self):
        return f"Worker: {self.user.email} - {self.identity_document}"

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=30, blank=True)
    city = models.CharField(max_length=80, default='Medellín')

    def __str__(self):
        return f"Client: {self.user.email} - {self.city}"
