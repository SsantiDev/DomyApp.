from rest_framework import serializers
from .models import Incident

class IncidentSerializer(serializers.ModelSerializer):
    reporter_name = serializers.ReadOnlyField(source='reporter.username')
    
    class Meta:
        model = Incident
        fields = [
            'id', 'service_request', 'reporter', 'reporter_name',
            'incident_type', 'description', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['reporter', 'status', 'created_at', 'updated_at']
