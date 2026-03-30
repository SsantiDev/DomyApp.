from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, viewsets, pagination
from django.db import models, transaction
import logging
from .serializers import (
    UserDetailSerializer, 
    UserRegistrationSerializer,
    WorkerVerificationSerializer,
    WorkerAdminDetailSerializer,
    ProfileSerializer,
    WorkerProfileSerializer,
    WorkerListSerializer
)
from .models import User, Profile, WorkerProfile, WorkerVerification
from .permissions import IsAdminUser
from django.utils import timezone
import random
import string
from .email_service import send_welcome_email, send_password_reset_email

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                user = serializer.save()
                # Send welcome email asynchronously (or directly for now)
                transaction.on_commit(lambda: send_welcome_email(user))
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


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """Generates a 6-digit code and sends it via email"""
    email = request.data.get('email')
    if not email:
        return Response({'error': 'El correo es obligatorio'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        # Generate 6-digit code
        code = ''.join(random.choices(string.digits, k=6))
        
        # Save or update reset code
        from .models import PasswordResetCode
        PasswordResetCode.objects.update_or_create(
            user=user,
            defaults={'code': code, 'created_at': timezone.now()}
        )
        
        # Send email
        send_password_reset_email(user, code)
        
    except User.DoesNotExist:
        # Don't reveal if user exists for security
        pass
    except Exception:
        logger.exception("Error during password reset request")
    
    return Response({'message': 'Si el correo existe, recibirá un código de recuperación.'})

@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    """Validates the code and updates the password"""
    email = request.data.get('email')
    code = request.data.get('code')
    new_password = request.data.get('new_password')
    
    if not all([email, code, new_password]):
        return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        from .models import PasswordResetCode
        reset_entry = PasswordResetCode.objects.get(user__email=email, code=code)
        
        # check expiration (15 min)
        if (timezone.now() - reset_entry.created_at).total_seconds() > 900:
            return Response({'error': 'El código ha expirado.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update password
        user = reset_entry.user
        user.set_password(new_password)
        user.save()
        
        # Delete code
        reset_entry.delete()
        
        return Response({'message': 'Contraseña actualizada con éxito.'})
        
    except PasswordResetCode.DoesNotExist:
        return Response({'error': 'Código o correo inválido.'}, status=status.HTTP_400_BAD_REQUEST)

class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class WorkerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for public worker search and listing.
    """
    serializer_class = WorkerListSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = WorkerProfile.objects.select_related('user', 'user__profile').filter(user__role=User.Role.WORKER)
        
        # Filters
        is_available = self.request.query_params.get('is_available')
        if is_available is not None:
            queryset = queryset.filter(is_available=is_available.lower() == 'true')
            
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            try:
                queryset = queryset.filter(average_rating__gte=float(min_rating))
            except ValueError:
                pass
                
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(user__profile__city__icontains=city)
            
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(user__profile__first_name__icontains=search) | 
                models.Q(user__profile__last_name__icontains=search) |
                models.Q(user__profile__address__icontains=search)
            )
            
        return queryset.order_by('-average_rating')
