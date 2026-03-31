import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.services.models import Category

categories = [
    {
        "name": "Limpieza General",
        "description": "Servicio completo de limpieza para el hogar o oficina.",
        "icon_name": "home-outline",
        "base_price": Decimal("60000.00")
    },
    {
        "name": "Plomería",
        "description": "Reparación de fugas, grifos y tuberías.",
        "icon_name": "water-outline",
        "base_price": Decimal("80000.00")
    },
    {
        "name": "Electricidad",
        "description": "Reparación de cortocircuitos, enchufes e iluminación.",
        "icon_name": "flash-outline",
        "base_price": Decimal("90000.00")
    },
    {
        "name": "Jardinería",
        "description": "Mantenimiento de jardines, poda y riego.",
        "icon_name": "leaf-outline",
        "base_price": Decimal("70000.00")
    },
    {
        "name": "Cuidado de Mascotas",
        "description": "Paseo y cuidado básico de mascotas.",
        "icon_name": "paw-outline",
        "base_price": Decimal("50000.00")
    }
]

for cat_data in categories:
    obj, created = Category.objects.get_or_create(
        name=cat_data["name"],
        defaults=cat_data
    )
    if created:
        print(f"Created category: {obj.name}")
    else:
        print(f"Category already exists: {obj.name}")
