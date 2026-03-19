from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import logging
from .serializers import (
    UserDetailSerializer, 
    UserRegistrationSerializer,
    WorkerVerificationSerializer,
    WorkerAdminDetailSerializer,
    ProfileSerializer,
    WorkerProfileSerializer
)
from .models import User, Profile, WorkerProfile, WorkerVerification
from .permissions import IsAdminUser
from django.utils import timezone

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
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
    serializer = UserDetailSerializer(request.user)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update profile (first_name, last_name, phone, etc)"""
    profile, _ = Profile.objects.get_or_create(user=request.user)
    serializer = ProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(UserDetailSerializer(request.user).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_availability(request):
    if request.user.role != User.Role.WORKER:
        return Response({'error': 'Solo los operarios pueden cambiar su estado de disponibilidad.'}, status=status.HTTP_403_FORBIDDEN)
    
    profile, _ = WorkerProfile.objects.get_or_create(user=request.user)
    profile.is_available = not profile.is_available
    profile.save()
    
    return Response({
        'is_available': profile.is_available,
        'message': f"Estado cambiado a {'Disponible' if profile.is_available else 'No disponible'}"
    })

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def submit_verification(request):
    if request.user.role != User.Role.WORKER:
        return Response({'error': 'Solo los operarios pueden enviar documentos.'}, status=status.HTTP_403_FORBIDDEN)

    verification, _ = WorkerVerification.objects.get_or_create(user=request.user)
    if verification.is_verified:
        return Response({'error': 'Tu perfil ya está verificado.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = WorkerVerificationSerializer(verification, data=request.data, partial=True)
    if serializer.is_valid():
        verification = serializer.save()
        verification.status = 'PENDING'
        verification.save()
        return Response({'message': 'Documentos enviados correctamente.', 'status': verification.status})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_pending_verifications(request):
    pending = WorkerVerification.objects.filter(status='PENDING').select_related('user', 'user__profile')
    # Since WorkerAdminDetailSerializer points to WorkerProfile, we need a different one or adjust.
    # For now let's just use simplified data
    return Response([{'id': v.id, 'email': v.user.email, 'status': v.status} for v in pending])

@api_view(['POST'])
@permission_classes([IsAdminUser])
def process_verification(request, pk):
    try:
        verification = WorkerVerification.objects.get(pk=pk)
    except WorkerVerification.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action') 
    reason = request.data.get('reason', '')

    if action == 'approve':
        verification.status = 'APPROVED'
        verification.is_verified = True
        verification.verified_at = timezone.now()
        verification.save()
        return Response({'status': 'approved'})
    elif action == 'reject':
        verification.status = 'REJECTED'
        verification.rejection_reason = reason
        verification.save()
        return Response({'status': 'rejected'})

    return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
