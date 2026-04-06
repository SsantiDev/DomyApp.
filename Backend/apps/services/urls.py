from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ServiceRequestViewSet, ServiceRequestNotificationViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'requests', ServiceRequestViewSet, basename='service-requests')
router.register(r'notifications', ServiceRequestNotificationViewSet, basename='service-notifications')

urlpatterns = [
    path('', include(router.urls)),
]
