from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.me, name='user_me'),
    path('register/', views.register, name='user_register'),
]
