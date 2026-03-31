from django.core.management.base import BaseCommand
from apps.services.models import Category

class Command(BaseCommand):
    help = 'Seed initial service categories'

    def handle(self, *args, **kwargs):
        categories = [
            {
                "name": "Limpieza",
                "description": "Limpieza general de casas y apartamentos.",
                "icon_name": "sparkles",
                "base_price": 50000.00
            },
            {
                "name": "Lavandería",
                "description": "Lavado y planchado de ropa.",
                "icon_name": "washing-machine",
                "base_price": 35000.00
            },
            {
                "name": "Plomería",
                "description": "Reparaciones básicas de tuberías y grifos.",
                "icon_name": "wrench",
                "base_price": 60000.00
            },
            {
                "name": "Electricidad",
                "description": "Reparaciones eléctricas menores.",
                "icon_name": "zap",
                "base_price": 60000.00
            },
            {
                "name": "Jardinería",
                "description": "Mantenimiento de jardines, poda y riego.",
                "icon_name": "leaf",
                "base_price": 70000.00
            },
            {
                "name": "Cuidado de Mascotas",
                "description": "Paseo y cuidado básico de mascotas.",
                "icon_name": "paw-print",
                "base_price": 50000.00
            }
        ]

        for cat_data in categories:
            Category.objects.get_or_create(
                name=cat_data["name"],
                defaults=cat_data
            )
            self.stdout.write(self.style.SUCCESS(f'Category "{cat_data["name"]}" created/updated'))
