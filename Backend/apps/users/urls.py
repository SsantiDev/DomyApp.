from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.me, name='user_me'),
    path('register/', views.register, name='user_register'),
    path('profile/', views.update_client_profile, name='update_client_profile'),
    path('profile/worker/', views.update_worker_profile, name='update_worker_profile'),
    path('profile/toggle-availability/', views.toggle_availability, name='toggle_availability'),
]
