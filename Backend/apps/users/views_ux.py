from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import UserAddress, FavoriteWorker
from .serializers import UserAddressSerializer, FavoriteWorkerSerializer

User = get_user_model()


class UserAddressViewSet(viewsets.ModelViewSet):
    serializer_class = UserAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAddress.objects.filter(user=self.request.user).order_by('-is_default', 'id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class FavoriteWorkerViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteWorkerSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        return FavoriteWorker.objects.filter(
            client=self.request.user
        ).select_related('worker', 'worker__profile', 'worker__worker_info')

    def create(self, request, *args, **kwargs):
        worker_id = request.data.get('worker_id')
        if not worker_id:
            return Response({'error': 'worker_id requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            worker = User.objects.get(pk=worker_id, role=User.Role.WORKER)
        except User.DoesNotExist:
            return Response({'error': 'Operaria no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        if worker == request.user:
            return Response({'error': 'No puedes añadirte a ti misma.'}, status=status.HTTP_400_BAD_REQUEST)

        fav, created = FavoriteWorker.objects.get_or_create(client=request.user, worker=worker)
        serializer = self.get_serializer(fav)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx
