from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.me, name='user_me'),
    path('register/', views.register, name='user_register'),
    path('profile/', views.update_profile, name='update_profile'), # Shared profile update
    path('profile/toggle-availability/', views.toggle_availability, name='toggle_availability'),
    path('profile/worker/submit-verification/', views.submit_verification, name='submit_verification'),
    
    # Admin View Paths
    path('admin/pending-verifications/', views.get_pending_verifications, name='admin_pending_verifications'),
    path('admin/verify-worker/<int:pk>/', views.process_verification, name='admin_process_verification'),
]
