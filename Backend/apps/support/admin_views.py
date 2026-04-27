import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Incident
from .serializers import IncidentSerializer

logger = logging.getLogger(__name__)


def require_admin(request):
    return request.user.is_authenticated and request.user.role == 'ADMIN'


class EscalateIncidentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if not require_admin(request):
            return Response({'detail': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            incident = Incident.objects.get(pk=pk)
        except Incident.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        note = request.data.get('note', '')
        incident.status = Incident.Status.ESCALATED
        incident.escalation_note = note
        incident.save()
        logger.info('Incident %s escalated by %s. Note: %s', pk, request.user.email, note)
        return Response(IncidentSerializer(incident).data)


class RefundFlagView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if not require_admin(request):
            return Response({'detail': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            incident = Incident.objects.get(pk=pk)
        except Incident.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        incident.needs_refund = True
        incident.save()
        logger.info('Refund flagged on incident %s by %s', pk, request.user.email)
        return Response(IncidentSerializer(incident).data)
