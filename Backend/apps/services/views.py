from django.utils import timezone
from django.db import models
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, ServiceRequest, Review
from .serializers import CategorySerializer, ServiceRequestSerializer, ReviewSerializer

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
            # Workers see requests assigned to them OR pending requests (to accept them)
            return ServiceRequest.objects.filter(
                models.Q(worker=user) | models.Q(status=ServiceRequest.Status.PENDING)
            )
        return ServiceRequest.objects.filter(client=user)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        service_request = self.get_object()
        user = request.user

        if user.role != 'WORKER':
            return Response(
                {"error": "Solo las operarias pueden aceptar servicios."},
                status=status.HTTP_403_FORBIDDEN
            )

        if service_request.status != ServiceRequest.Status.PENDING:
            return Response(
                {"error": "Este servicio ya no está disponible."},
                status=status.HTTP_400_BAD_REQUEST
            )

        service_request.worker = user
        service_request.status = ServiceRequest.Status.ACCEPTED
        service_request.save()

        return Response(self.get_serializer(service_request).data)

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        service_request = self.get_object()
        if request.user != service_request.worker:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        if service_request.status != ServiceRequest.Status.ACCEPTED:
            return Response({"error": "No se puede iniciar"}, status=status.HTTP_400_BAD_REQUEST)
        
        service_request.status = ServiceRequest.Status.IN_PROGRESS
        service_request.save()
        return Response(self.get_serializer(service_request).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        service_request = self.get_object()
        if request.user != service_request.worker:
            return Response({"error": "No autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        if service_request.status != ServiceRequest.Status.IN_PROGRESS:
            return Response({"error": "Solo se pueden completar servicios en proceso"}, status=status.HTTP_400_BAD_REQUEST)
        
        service_request.status = ServiceRequest.Status.COMPLETED
        service_request.completed_at = timezone.now()
        service_request.save()
        return Response(self.get_serializer(service_request).data)

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        service_request = self.get_object()
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
