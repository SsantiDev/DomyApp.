from django.db import models
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import viewsets, permissions
from .models import Message
from .serializers import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        service_id = self.request.query_params.get('service_request')
        is_support = self.request.query_params.get('is_support_chat')
        
        queryset = Message.objects.all()

        if service_id:
            queryset = queryset.filter(service_request_id=service_id)
            
        if is_support is not None:
            # Cast to boolean
            bool_is_support = is_support.lower() == 'true'
            queryset = queryset.filter(is_support_chat=bool_is_support)

        if user.role != 'ADMIN':
            # Workers / Clients only see messages for services they are involved in
            queryset = queryset.filter(
                models.Q(service_request__client=user) | 
                models.Q(service_request__worker=user)
            )

        # Auto mark as read messages from other senders
        unread_messages = queryset.filter(is_read=False).exclude(sender=user)
        if unread_messages.exists():
            unread_messages.update(is_read=True)

        return queryset

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        
        # Acciones automáticas si el ADMIN envía un mensaje de soporte
        if message.is_support_chat and self.request.user.role == 'ADMIN':
            from apps.support.models import Incident
            open_incidents = Incident.objects.filter(
                service_request=message.service_request, 
                status=Incident.Status.OPEN
            )
            if open_incidents.exists():
                open_incidents.update(status=Incident.Status.IN_REVIEW)
                if not message.content.startswith('⚠️ [Respuesta a Incidencia]'):
                    message.content = f"⚠️ [Respuesta a Incidencia]\n{message.content}"
                    message.save(update_fields=['content'])

        channel_layer = get_channel_layer()
        if channel_layer is None:
            return

        async_to_sync(channel_layer.group_send)(
            f'chat_service_{message.service_request_id}',
            {
                'type': 'chat_message',
                'id': message.id,
                'sender_id': message.sender_id,
                'sender_name': message.sender.get_full_name() or message.sender.email,
                'sender_role': message.sender.role,
                'content': message.content,
                'created_at': message.created_at.isoformat(),
            }
        )
