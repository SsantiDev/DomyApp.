import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        if not user or isinstance(user, AnonymousUser):
            await self.close(code=4001)
            return

        self.user_id = user.id
        self.group_name = f'user_{self.user_id}'

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        pass  # Clients only receive, not send on this socket

    async def service_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'STATUS_CHANGE',
            'payload': event['payload'],
            'timestamp': event['timestamp'],
        }))

    async def new_request_available(self, event):
        await self.send(text_data=json.dumps({
            'type': 'SYSTEM_ALERT',
            'payload': event['payload'],
            'timestamp': event['timestamp'],
        }))
