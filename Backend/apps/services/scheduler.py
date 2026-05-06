import os
import time
import threading
import logging
from datetime import timedelta
from django.utils import timezone

logger = logging.getLogger(__name__)

def start_reminder_scheduler():
    # In Django runserver, the ready() method is run twice.
    # RUN_MAIN is 'true' in the reloader (main execution process).
    # If SERVER_SOFTWARE is not runserver (e.g. production/gunicorn/uwsgi), RUN_MAIN won't be set, but we still want to run it.
    is_reloader = os.environ.get('RUN_MAIN') == 'true'
    is_development = 'runserver' in os.sys.argv or any('manage.py' in arg for arg in os.sys.argv)

    if is_development and not is_reloader:
        # Prevent starting thread on the parent process in development mode
        return

    # Avoid starting multiple threads in the same process
    if getattr(start_reminder_scheduler, '_started', False):
        return
    start_reminder_scheduler._started = True

    thread = threading.Thread(target=_scheduler_loop, name="DomyServiceReminders", daemon=True)
    thread.start()
    logger.info("Background Service Reminder daemon thread started successfully!")

def _scheduler_loop():
    # Wait 15 seconds after server startup to let everything initialize properly
    time.sleep(15)
    
    while True:
        try:
            _run_reminders()
        except Exception as e:
            logger.error(f"Error running background service reminders loop: {e}")
            
        # Sleep for 1 hour (3600 seconds)
        time.sleep(3600)

def _run_reminders():
    from apps.services.models import ServiceRequest
    from apps.chat.models import Message
    from apps.users.email_service import send_service_reminder_email

    now = timezone.now()
    tomorrow_start = now + timedelta(hours=20)
    tomorrow_end = now + timedelta(hours=28)

    # Find accepted services scheduled tomorrow
    services = ServiceRequest.objects.filter(
        status=ServiceRequest.Status.ACCEPTED,
        scheduled_at__range=(tomorrow_start, tomorrow_end)
    )

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
                    logger.warning(f"Error sending client reminder email: {e}")

            # 2. Send email to worker
            if service.worker:
                try:
                    send_service_reminder_email(service, service.worker)
                except Exception as e:
                    logger.warning(f"Error sending worker reminder email: {e}")

            # 3. Create a system chat message alert (sender=service.client satisfies not-null constraint)
            try:
                Message.objects.create(
                    service_request=service,
                    sender=service.client,
                    content="⏰ Recordatorio automático: Este servicio está agendado para mañana. ¡Nos vemos pronto!",
                    is_support_chat=False
                )
                logger.info(f"Sent automatic background reminder for service {service.id}")
            except Exception as e:
                logger.error(f"Error creating chat message reminder: {e}")
