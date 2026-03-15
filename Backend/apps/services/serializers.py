from rest_framework import serializers
from .models import Category, ServiceRequest, Review

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment', 'created_at']

class ServiceRequestSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    client_email = serializers.ReadOnlyField(source='client.email')
    review = ReviewSerializer(read_only=True)

    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'client', 'worker', 'category', 'category_name', 
            'client_email', 'status', 'scheduled_at', 'address', 
            'latitude', 'longitude', 'details', 'total_price', 
            'created_at', 'completed_at', 'review'
        ]
        read_only_fields = ['client', 'status', 'total_price', 'created_at', 'completed_at']

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
