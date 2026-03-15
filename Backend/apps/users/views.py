from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.db import transaction
import logging
from .serializers import (
    UserDetailSerializer, 
    ClientProfileUpdateSerializer, 
    WorkerProfileUpdateSerializer,
    UserRegistrationSerializer
)
from .models import User, ClientProfile, WorkerProfile

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user (Client or Worker)
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                user = serializer.save()
                detail_serializer = UserDetailSerializer(user)
                return Response(detail_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception("Error during user registration")
            return Response({'error': f"Error al crear usuario: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    Retrieve the authenticated user's profile.
    """
    serializer = UserDetailSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_availability(request):
    """
    Toggle the availability status of the authenticated worker.
    """
    if request.user.role != User.Role.WORKER:
        return Response({'error': 'Solo los operarios pueden cambiar su estado de disponibilidad.'}, status=status.HTTP_403_FORBIDDEN)
    
    profile = request.user.worker_profile
    profile.is_available = not profile.is_available
    profile.save()
    
    return Response({
        'is_available': profile.is_available,
        'message': f"Estado cambiado a {'Disponible' if profile.is_available else 'No disponible'}"
    })
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_client_profile(request):
    """
    Partially update the authenticated client's profile data.
    """
    if request.user.role != User.Role.CLIENT:
        return Response(
            {'error': 'Solo los clientes pueden actualizar su perfil desde este endpoint.'},
            status=status.HTTP_403_FORBIDDEN
        )

    profile, _ = ClientProfile.objects.get_or_create(user=request.user)
    serializer = ClientProfileUpdateSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        user_serializer = UserDetailSerializer(request.user)
        return Response(user_serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_worker_profile(request):
    """
    Partially update the authenticated worker's profile data.
    """
    if request.user.role != User.Role.WORKER:
        return Response(
            {'error': 'Solo los operarios pueden actualizar su perfil desde este endpoint.'},
            status=status.HTTP_403_FORBIDDEN
        )

    profile, _ = WorkerProfile.objects.get_or_create(user=request.user)
    serializer = WorkerProfileUpdateSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        user_serializer = UserDetailSerializer(request.user)
        return Response(user_serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
