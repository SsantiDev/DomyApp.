from django.urls import path, include
from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register(r'workers', views.WorkerViewSet, basename='worker')

urlpatterns = [
    path('', include(router.urls)),
    path('me/', views.me, name='user_me'),
    path('register/', views.register, name='user_register'),
    path('profile/', views.update_profile, name='update_profile'),
    path('profile/worker/', views.update_worker_profile, name='update_worker_profile'),
    path('profile/toggle-availability/', views.toggle_availability, name='toggle_availability'),
    path('profile/worker/submit-verification/', views.submit_verification, name='submit_verification'),
    
    # Admin View Paths
    path('admin/pending-verifications/', views.get_pending_verifications, name='admin_pending_verifications'),
    path('admin/verify-worker/<int:pk>/', views.process_verification, name='admin_process_verification'),
    path('admin/users/', views.admin_user_list, name='admin_user_list'),
    path('admin/users/<int:pk>/', views.admin_user_detail, name='admin_user_detail'),
    
    # Password Reset
    path('password-reset/request/', views.request_password_reset, name='password_reset_request'),
    path('password-reset/confirm/', views.confirm_password_reset, name='password_reset_confirm'),
]
