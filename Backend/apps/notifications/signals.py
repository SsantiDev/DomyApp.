from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


def broadcast_to_user(user_id, event_type, payload):
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return
    async_to_sync(channel_layer.group_send)(
        f'user_{user_id}',
        {
            'type': event_type,
            'payload': payload,
            'timestamp': timezone.now().isoformat(),
        }
    )


@receiver(post_save, sender='services.ServiceRequest')
def on_service_request_save(sender, instance, created, update_fields=None, **kwargs):
    from apps.users.models import User

    # Skip broadcast if only non-status fields changed
    if not created and update_fields is not None and 'status' not in update_fields:
        return

    if created:
        # Notify available workers whose categories include the requested category.
        # worker_info__is_available filters workers currently accepting jobs.
        # worker_info__categories filters by the service category.
        workers = User.objects.filter(
            role='WORKER',
            is_active=True,
            worker_info__is_available=True,
            worker_info__categories=instance.category,
        )
        payload = {
            'service_id': instance.id,
            'category': instance.category.name,
            'message': 'Nueva solicitud disponible',
        }
        for worker in workers:
            broadcast_to_user(worker.id, 'new_request_available', payload)
    else:
        # Notify client and assigned worker of any status change.
        status_payload = {
            'service_id': instance.id,
            'status': instance.status,
            'message': f'Tu solicitud cambió a {instance.status}',
        }

        # Notify client (field confirmed: ServiceRequest.client)
        if instance.client_id:
            broadcast_to_user(instance.client_id, 'service_update', status_payload)

        # Notify worker if assigned (field confirmed: ServiceRequest.worker)
        if instance.worker_id:
            broadcast_to_user(instance.worker_id, 'service_update', status_payload)
