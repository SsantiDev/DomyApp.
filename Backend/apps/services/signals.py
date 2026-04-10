from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Avg
from .models import Review

@receiver(post_save, sender=Review)
def update_worker_rating(sender, instance, **kwargs):
    worker = instance.service_request.worker
    if worker:
        # Calculate new average from all reviews of this worker's service requests
        stats = Review.objects.filter(service_request__worker=worker).aggregate(Avg('rating'))
        new_avg = stats['rating__avg'] or 0.0
        
        # Update WorkerProfile
        if hasattr(worker, 'worker_info'):
            worker.worker_info.average_rating = new_avg
            worker.worker_info.save()
