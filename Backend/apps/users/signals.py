from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import User, WorkerProfile, ClientProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == User.Role.WORKER:
            WorkerProfile.objects.get_or_create(user=instance)
        elif instance.role == User.Role.CLIENT:
            ClientProfile.objects.get_or_create(user=instance)
