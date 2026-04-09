from django.db import models
from rest_framework import viewsets, permissions
from .models import Incident
from .serializers import IncidentSerializer

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Incident.objects.all()
            
        # Users can see incidents they reported or related to services they are involved in
        return Incident.objects.filter(
            models.Q(reporter=user) |
            models.Q(service_request__client=user) |
            models.Q(service_request__worker=user)
        ).distinct()
