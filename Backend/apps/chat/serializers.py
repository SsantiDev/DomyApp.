from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_role = serializers.ReadOnlyField(source='sender.role')

    class Meta:
        model = Message
        fields = [
            'id', 'service_request', 'sender', 'sender_name', 'sender_role',
            'is_support_chat', 'content', 'is_read', 'created_at'
        ]
        read_only_fields = ['sender', 'created_at', 'is_read']

    def get_sender_name(self, obj):
        if obj.sender and hasattr(obj.sender, 'profile'):
            name = f"{obj.sender.profile.first_name} {obj.sender.profile.last_name}".strip()
            return name if name else obj.sender.email
        return obj.sender.email
