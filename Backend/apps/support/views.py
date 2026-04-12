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
            qs = Incident.objects.all()
        else:
            qs = Incident.objects.filter(
                models.Q(reporter=user) |
                models.Q(service_request__client=user) |
                models.Q(service_request__worker=user)
            ).distinct()

        service_request_id = self.request.query_params.get('service_request')
        if service_request_id:
            qs = qs.filter(service_request_id=service_request_id)

        return qs
