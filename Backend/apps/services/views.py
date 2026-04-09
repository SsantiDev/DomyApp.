from django.utils import timezone
from django.db import models, transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Category, ServiceRequest, Review, ServiceRequestNotification
from .serializers import CategorySerializer, ServiceRequestSerializer, ReviewSerializer, ServiceRequestNotificationSerializer

User = get_user_model()

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ServiceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ServiceRequest.objects.none()
            
        if user.role == 'ADMIN':
            return ServiceRequest.objects.all()
        elif user.role == 'WORKER':
            # Workers only see requests directly assigned to them in this viewset
            # Pending unassigned requests will be fetched via ServiceRequestNotificationViewSet
            return ServiceRequest.objects.filter(worker=user)
        return ServiceRequest.objects.filter(client=user)

    def perform_create(self, serializer):
        # Create the Service Request
        service_request = serializer.save(client=self.request.user)
        
        # Intelligent Routing: Direct vs Broadcast
        if service_request.worker:
            # DIRECT assignment
            ServiceRequestNotification.objects.create(
                service_request=service_request,
                worker=service_request.worker,
                status=ServiceRequestNotification.Status.PENDING
            )
        else:
            # BROADCAST assignment to available workers who cover this category
            available_workers = User.objects.filter(
                role=User.Role.WORKER,
                worker_info__is_available=True,
                worker_info__categories=service_request.category
            )
            notifications = [
                ServiceRequestNotification(
                    service_request=service_request,
                    worker=worker,
                    status=ServiceRequestNotification.Status.PENDING
                )
                for worker in available_workers
            ]
            ServiceRequestNotification.objects.bulk_create(notifications)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        user = request.user
        if user.role != 'WORKER':
            return Response(
                {"error": "Solo las operarias pueden aceptar servicios."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Atomic transaction to prevent race conditions
        with transaction.atomic():
            try:
                # Lock the row until the transaction completes
                service_request = ServiceRequest.objects.select_for_update().get(pk=pk)
            except ServiceRequest.DoesNotExist:
                return Response({"error": "Servicio no encontrado."}, status=status.HTTP_404_NOT_FOUND)

            try:
                notification = ServiceRequestNotification.objects.get(
                    service_request=service_request,
                    worker=user
                )
            except ServiceRequestNotification.DoesNotExist:
                return Response({"error": "No tienes permiso para ver esta solicitud."}, status=status.HTTP_403_FORBIDDEN)

            if service_request.status != ServiceRequest.Status.PENDING:
                # Someone else already accepted it
                notification.status = ServiceRequestNotification.Status.CANCELLED
                notification.save()
                return Response(
                    {"error": "Este servicio ya fue asignado a otra operaria."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # I won the race! Claim the service request
            service_request.worker = user
            service_request.status = ServiceRequest.Status.ACCEPTED
            service_request.save()

            # Mark my notification as ACCEPTED
            notification.status = ServiceRequestNotification.Status.ACCEPTED
            notification.save()

            # Mark all other pending notifications for this service as CANCELLED
            ServiceRequestNotification.objects.filter(
                service_request=service_request,
                status=ServiceRequestNotification.Status.PENDING
            ).exclude(worker=user).update(status=ServiceRequestNotification.Status.CANCELLED)

            return Response(self.get_serializer(service_request).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        user = request.user
        if user.role != 'WORKER':
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        reason = request.data.get('reason', '')

        try:
            notification = ServiceRequestNotification.objects.get(
                service_request_id=pk,
                worker=user
            )
        except ServiceRequestNotification.DoesNotExist:
            return Response({"error": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)

        notification.status = ServiceRequestNotification.Status.REJECTED
        notification.rejection_reason = reason
        notification.save()

        # If all notifications for this request are REJECTED or CANCELLED,
        # we could systematically mark the ServiceRequest as CANCELLED, but for MVP we leave it PENDING
        return Response({"status": "rejected"})

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        # Allow querying outside get_queryset restrictions using objects.get
        try:
            service_request = ServiceRequest.objects.get(pk=pk)
        except ServiceRequest.DoesNotExist:
            return Response({"error": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
            
        if request.user != service_request.worker:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        if service_request.status != ServiceRequest.Status.ACCEPTED:
            return Response({"error": "No se puede iniciar"}, status=status.HTTP_400_BAD_REQUEST)
        
        service_request.status = ServiceRequest.Status.IN_PROGRESS
        service_request.save()
        return Response(self.get_serializer(service_request).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        try:
            service_request = ServiceRequest.objects.get(pk=pk)
        except ServiceRequest.DoesNotExist:
            return Response({"error": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
            
        if request.user != service_request.worker:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        if service_request.status != ServiceRequest.Status.IN_PROGRESS:
            return Response({"error": "Solo se pueden completar servicios en proceso"}, status=status.HTTP_400_BAD_REQUEST)
        
        service_request.status = ServiceRequest.Status.COMPLETED
        service_request.completed_at = timezone.now()
        service_request.save()
        return Response(self.get_serializer(service_request).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        try:
            service_request = ServiceRequest.objects.get(pk=pk)
        except ServiceRequest.DoesNotExist:
            return Response({"error": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if user.role == 'CLIENT':
            if service_request.client != user:
                return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)
            if service_request.status not in [ServiceRequest.Status.PENDING, ServiceRequest.Status.ACCEPTED]:
                return Response(
                    {"error": "Solo puedes cancelar servicios pendientes o aceptados."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        elif user.role == 'WORKER':
            if service_request.worker != user:
                return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)
            if service_request.status != ServiceRequest.Status.ACCEPTED:
                return Response(
                    {"error": "Solo puedes abandonar servicios que hayas aceptado y no iniciado."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)

        service_request.status = ServiceRequest.Status.CANCELLED
        service_request.save()
        return Response(self.get_serializer(service_request).data)

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        try:
            service_request = ServiceRequest.objects.get(pk=pk)
        except ServiceRequest.DoesNotExist:
            return Response({"error": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
            
        if request.user != service_request.client:
            return Response({"error": "Solo el cliente puede calificar"}, status=status.HTTP_403_FORBIDDEN)
        
        if service_request.status != ServiceRequest.Status.COMPLETED:
            return Response({"error": "Solo se pueden calificar servicios completados"}, status=status.HTTP_400_BAD_REQUEST)
        
        if hasattr(service_request, 'review'):
            return Response({"error": "Ya has calificado este servicio"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(service_request=service_request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServiceRequestNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Workers can read their own service request notifications.
    """
    serializer_class = ServiceRequestNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or user.role != 'WORKER':
            return ServiceRequestNotification.objects.none()
        
        # Filter by PENDING status to show in their incoming requests dashboard
        return ServiceRequestNotification.objects.filter(
            worker=user,
            status=ServiceRequestNotification.Status.PENDING
        ).order_by('-created_at')
