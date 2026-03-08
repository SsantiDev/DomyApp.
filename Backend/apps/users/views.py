from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .serializers import UserDetailSerializer
from .models import User, ClientProfile, WorkerProfile

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user (Client or Worker)
    """
    data = request.data
    try:
        if User.objects.filter(username=data.get('username')).exists():
            return Response({'error': 'El nombre de usuario ya existe.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'El correo electrónico ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password'),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            role=data.get('role', User.Role.CLIENT)
        )

        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        import traceback
        print(traceback.format_exc()) # Log detailed error on server
        return Response({'error': f"Error en el servidor: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

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
