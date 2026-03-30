import os
import django
from django.core.mail import send_mail
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def test_send():
    recipient = 'jorge.grisales102@pascualbravo.edu.co'
    print(f"Probando envío a {recipient}...")
    try:
        sent = send_mail(
            'Prueba Domy #123',
            'Tu código es 618592',
            settings.DEFAULT_FROM_EMAIL,
            [recipient],
            fail_silently=False,
        )
        print(f"🎉 ÉXITO: {sent} correo enviado.")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

if __name__ == '__main__':
    test_send()
