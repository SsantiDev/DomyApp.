import os
import django

def delete_user_and_data(email):
    try:
        from apps.users.models import User
        from django.db import transaction
        user = User.objects.get(email=email)
        print(f"Found user: {user.email} (Role: {user.role})")
        
        # Confirmation count
        related_data = []
        if hasattr(user, 'profile'):
            related_data.append("Profile")
        if hasattr(user, 'worker_info'):
            related_data.append("Worker Profile")
        if hasattr(user, 'verification'):
            related_data.append("Verification docs")
        
        # Service requests where they are client
        try:
            sr_count = user.service_requests_as_client.count()
            if sr_count > 0:
                related_data.append(f"{sr_count} Service Requests (as client)")
        except AttributeError:
            pass

        # Messages sent
        try:
            msg_count = user.sent_messages.count()
            if msg_count > 0:
                related_data.append(f"{msg_count} Sent Messages")
        except AttributeError:
            pass

        print(f"This will delete: {', '.join(related_data)}")
        
        with transaction.atomic():
            user.delete()
            print(f"Successfully deleted user {email} and all associated data.")
            
    except User.DoesNotExist:
        print(f"User with email {email} not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Setup Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()
    email_to_delete = "yisusel80@gmail.com"
    delete_user_and_data(email_to_delete)
