from rest_framework import serializers
from .models import Category, ServiceRequest, Review, ServiceRequestNotification

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment', 'created_at']

from apps.support.serializers import IncidentSerializer

class ServiceRequestSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    client_email = serializers.ReadOnlyField(source='client.email')
    client_name = serializers.SerializerMethodField()
    worker_email = serializers.ReadOnlyField(source='worker.email')
    worker_name = serializers.SerializerMethodField()
    review = ReviewSerializer(read_only=True)
    incidents = IncidentSerializer(many=True, read_only=True)
    unread_messages_count = serializers.SerializerMethodField()
    unread_coordination_count = serializers.SerializerMethodField()
    unread_support_count = serializers.SerializerMethodField()

    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'client', 'worker', 'category', 'category_name', 
            'client_email', 'client_name', 'worker_email', 'worker_name', 
            'status', 'scheduled_at', 'address', 
            'latitude', 'longitude', 'details', 'total_price', 
            'created_at', 'completed_at', 'is_billed', 'review', 'incidents',
            'unread_messages_count', 'unread_coordination_count', 'unread_support_count'
        ]
        read_only_fields = ['client', 'status', 'total_price', 'created_at', 'completed_at', 'is_billed']

    def get_unread_messages_count(self, obj):
        request = self.context.get('request')
        if not request or not request.user: return 0
        user = request.user
        
        # Admin unread check just for support chats within the service
        qs = obj.messages.filter(is_read=False).exclude(sender=user)
        if user.role == 'ADMIN':
            return qs.filter(is_support_chat=True).count()
        return qs.count()

    def get_unread_coordination_count(self, obj):
        request = self.context.get('request')
        if not request or not request.user: return 0
        if request.user.role == 'ADMIN': return 0
        qs = obj.messages.filter(is_read=False, is_support_chat=False).exclude(sender=request.user)
        return qs.count()

    def get_unread_support_count(self, obj):
        request = self.context.get('request')
        if not request or not request.user: return 0
        qs = obj.messages.filter(is_read=False, is_support_chat=True).exclude(sender=request.user)
        return qs.count()

    def get_client_name(self, obj):
        if obj.client and hasattr(obj.client, 'profile'):
            return f"{obj.client.profile.first_name} {obj.client.profile.last_name}".strip()
        return ""

    def get_worker_name(self, obj):
        if obj.worker and hasattr(obj.worker, 'profile'):
            return f"{obj.worker.profile.first_name} {obj.worker.profile.last_name}".strip()
        return ""

    def create(self, validated_data):
        # Automatically set client from request
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['client'] = request.user
        
        # In a real app, logic to calculate total_price would go here
        # For MVP, we take base_price as total_price
        category = validated_data.get('category')
        validated_data['total_price'] = category.base_price
        
        return super().create(validated_data)

class ServiceRequestNotificationSerializer(serializers.ModelSerializer):
    service_request_details = ServiceRequestSerializer(source='service_request', read_only=True)
    
    class Meta:
        model = ServiceRequestNotification
        fields = [
            'id', 'service_request', 'service_request_details', 'worker', 
            'status', 'rejection_reason', 'created_at', 'updated_at'
        ]
        read_only_fields = ['worker', 'status', 'created_at', 'updated_at']

