from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.services.models import ServiceRequest
from apps.chat.models import Message
from apps.users.email_service import send_service_reminder_email

class Command(BaseCommand):
    help = 'Send email reminders and create chat alerts for services scheduled in approximately 24 hours'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        tomorrow_start = now + timedelta(hours=20)
        tomorrow_end = now + timedelta(hours=28)

        # Find accepted services scheduled tomorrow
        services = ServiceRequest.objects.filter(
            status=ServiceRequest.Status.ACCEPTED,
            scheduled_at__range=(tomorrow_start, tomorrow_end)
        )

        count = 0
        for service in services:
            # Prevent duplicate reminders using chat message tracking
            already_reminded = Message.objects.filter(
                service_request=service,
                content__icontains="Recordatorio automático"
            ).exists()

            if not already_reminded:
                # 1. Send email to client
                if service.client:
                    try:
                        send_service_reminder_email(service, service.client)
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(f'Failed to send email to client: {e}'))

                # 2. Send email to worker
                if service.worker:
                    try:
                        send_service_reminder_email(service, service.worker)
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(f'Failed to send email to worker: {e}'))

                # 3. Create a system chat message alert (sender=service.client satisfies not-null constraint)
                try:
                    Message.objects.create(
                        service_request=service,
                        sender=service.client,
                        content="⏰ Recordatorio automático: Este servicio está agendado para mañana. ¡Nos vemos pronto!",
                        is_support_chat=False
                    )
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Failed to create chat message: {e}'))

                count += 1
                self.stdout.write(self.style.SUCCESS(f'Sent reminder for service {service.id}'))

        self.stdout.write(self.style.SUCCESS(f'Completed. Sent {count} reminders.'))
