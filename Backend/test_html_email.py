"""
Run this script to send a test of both HTML emails.
Usage: .venv\Scripts\python.exe test_html_email.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User
from apps.users.email_service import send_welcome_email, send_password_reset_email

def run():
    user = User.objects.filter(email__icontains='pascualbravo').first()
    if not user:
        user = User.objects.first()

    if not user:
        print("No se encontró ningún usuario en la base de datos.")
        return

    print(f"Enviando correos de prueba a: {user.email}")
    send_welcome_email(user)
    send_password_reset_email(user, '618592')
    print("✅ Ambos correos enviados. Revisa tu bandeja de entrada.")

if __name__ == '__main__':
    run()
