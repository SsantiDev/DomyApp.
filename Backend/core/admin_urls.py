from django.urls import path
from .admin_views import FinanceSummaryView, WorkerPenaltyView, WorkerRejectionRateView

urlpatterns = [
    path('finance/summary/', FinanceSummaryView.as_view(), name='admin-finance-summary'),
    path('workers/<int:worker_id>/penalty/', WorkerPenaltyView.as_view(), name='admin-worker-penalty'),
    path('metrics/workers/rejection-rate/', WorkerRejectionRateView.as_view(), name='admin-rejection-rate'),
]
