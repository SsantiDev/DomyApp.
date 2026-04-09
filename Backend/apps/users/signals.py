from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import User, Profile, WorkerProfile, WorkerVerification
from .services import EmailService

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Every user gets a profile
        Profile.objects.get_or_create(user=instance)
        
        # Specific profiles for workers
        if instance.role == User.Role.WORKER:
            WorkerProfile.objects.get_or_create(user=instance)
            WorkerVerification.objects.get_or_create(user=instance)
