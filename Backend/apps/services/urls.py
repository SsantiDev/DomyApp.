from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ServiceRequestViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'requests', ServiceRequestViewSet, basename='service-requests')

urlpatterns = [
    path('', include(router.urls)),
]
