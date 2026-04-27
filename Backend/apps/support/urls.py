from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IncidentViewSet
from .admin_views import EscalateIncidentView, RefundFlagView

router = DefaultRouter()
router.register(r'incidents', IncidentViewSet, basename='incident')

urlpatterns = [
    path('', include(router.urls)),
    path('incidents/<int:pk>/escalate/', EscalateIncidentView.as_view(), name='incident-escalate'),
    path('incidents/<int:pk>/refund/', RefundFlagView.as_view(), name='incident-refund'),
]
