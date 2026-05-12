from django.apps import AppConfig


class ServicesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.services'

    def ready(self):
        from . import signals  # noqa: F401
        from .scheduler import start_reminder_scheduler
        start_reminder_scheduler()
