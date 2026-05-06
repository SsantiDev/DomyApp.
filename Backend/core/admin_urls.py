from django.urls import path
from .admin_views import (
    FinanceSummaryView, 
    WorkerPenaltyView, 
    WorkerRejectionRateView,
    FinanceExcelExportView,
    FinancePDFExportView
)

urlpatterns = [
    path('finance/summary/', FinanceSummaryView.as_view(), name='admin-finance-summary'),
    path('finance/export/excel/', FinanceExcelExportView.as_view(), name='admin-finance-export-excel'),
    path('finance/export/pdf/', FinancePDFExportView.as_view(), name='admin-finance-export-pdf'),
    path('workers/<int:worker_id>/penalty/', WorkerPenaltyView.as_view(), name='admin-worker-penalty'),
    path('metrics/workers/rejection-rate/', WorkerRejectionRateView.as_view(), name='admin-rejection-rate'),
]
