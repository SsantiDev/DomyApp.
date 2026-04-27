import logging
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.services.models import ServiceRequest

logger = logging.getLogger(__name__)


def require_admin(request):
    return request.user.is_authenticated and request.user.role == 'ADMIN'


class FinanceSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not require_admin(request):
            return Response({'detail': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)

        total_revenue = ServiceRequest.objects.filter(
            status=ServiceRequest.Status.COMPLETED
        ).aggregate(total=Sum('total_price'))['total'] or 0

        platform_commissions = float(total_revenue) * settings.PLATFORM_FEE_PERCENTAGE
        return Response({
            'total_revenue': float(total_revenue),
            'platform_commissions': round(platform_commissions, 2),
            'pending_payouts': 0,
            'period': 'monthly',
        })


class WorkerPenaltyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, worker_id):
        if not require_admin(request):
            return Response({'detail': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)

        from apps.users.models import User
        try:
            worker = User.objects.get(pk=worker_id, role='WORKER')
        except User.DoesNotExist:
            return Response({'detail': 'Worker not found.'}, status=status.HTTP_404_NOT_FOUND)

        reason = request.data.get('reason', '')
        deduction = float(request.data.get('deduction', 0.5))

        if hasattr(worker, 'worker_info') and worker.worker_info.average_rating is not None:
            worker.worker_info.average_rating = max(0, float(worker.worker_info.average_rating) - deduction)
            worker.worker_info.save()

        logger.info(
            'Penalty applied to worker %s by admin %s. Reason: %s. Deduction: %s',
            worker_id, request.user.email, reason, deduction
        )
        return Response({
            'status': 'penalty_applied',
            'worker_id': worker_id,
            'reason': reason,
            'applied_by': request.user.email,
        })


class WorkerRejectionRateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not require_admin(request):
            return Response({'detail': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)

        since = timezone.now() - timedelta(days=30)
        results = (
            ServiceRequest.objects
            .filter(status=ServiceRequest.Status.CANCELLED, updated_at__gte=since, worker__isnull=False)
            .values('worker__id', 'worker__first_name', 'worker__last_name', 'worker__email')
            .annotate(cancellations=Count('id'))
            .filter(cancellations__gt=0)
            .order_by('-cancellations')
        )
        data = [
            {
                'worker_id': r['worker__id'],
                'worker_name': f"{r['worker__first_name']} {r['worker__last_name']}".strip() or r['worker__email'],
                'cancellations': r['cancellations'],
            }
            for r in results
        ]
        return Response(data)
