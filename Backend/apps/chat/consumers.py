import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        if not user or isinstance(user, AnonymousUser):
            await self.close(code=4001)
            return

        self.service_id = self.scope['url_route']['kwargs']['service_id']
        self.group_name = f'chat_service_{self.service_id}'

        # Verify user has access to this service request
        has_access = await self.check_access(user, self.service_id)
        if not has_access:
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Mark unread messages as read on connect
        await self.mark_messages_read(user, self.service_id)

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        user = self.scope.get('user')
        if not user or isinstance(user, AnonymousUser):
            return

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        msg_type = data.get('type')

        if msg_type == 'mark_read':
            await self.mark_messages_read(user, self.service_id)
            return

        if msg_type == 'chat_message':
            content = data.get('content', '').strip()
            if not content:
                return

            message = await self.save_message(user, self.service_id, content)
            if message is None:
                return

            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'chat_message',
                    'id': message['id'],
                    'sender_id': message['sender_id'],
                    'sender_name': message['sender_name'],
                    'sender_role': message['sender_role'],
                    'content': message['content'],
                    'created_at': message['created_at'],
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'CHAT',
            'payload': {
                'id': event['id'],
                'sender_id': event['sender_id'],
                'sender_name': event['sender_name'],
                'sender_role': event['sender_role'],
                'content': event['content'],
                'created_at': event['created_at'],
            },
            'timestamp': event['created_at'],
        }))

    @database_sync_to_async
    def check_access(self, user, service_id):
        from apps.services.models import ServiceRequest
        try:
            sr = ServiceRequest.objects.get(id=service_id)
            return sr.client == user or sr.worker == user or user.role == 'ADMIN'
        except ServiceRequest.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, user, service_id, content):
        from apps.chat.models import Message
        from apps.services.models import ServiceRequest
        try:
            sr = ServiceRequest.objects.get(id=service_id)
            msg = Message.objects.create(
                service_request=sr,
                sender=user,
                content=content,
            )
            return {
                'id': msg.id,
                'sender_id': user.id,
                'sender_name': user.get_full_name() or user.email,
                'sender_role': user.role,
                'content': msg.content,
                'created_at': msg.created_at.isoformat(),
            }
        except ServiceRequest.DoesNotExist:
            return None

    @database_sync_to_async
    def mark_messages_read(self, user, service_id):
        from apps.chat.models import Message
        Message.objects.filter(
            service_request_id=service_id,
            is_read=False,
        ).exclude(sender=user).update(is_read=True)
