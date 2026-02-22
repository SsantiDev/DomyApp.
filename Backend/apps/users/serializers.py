from rest_framework import serializers
from .models import User, WorkerProfile, ClientProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'first_name', 'last_name')

class WorkerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerProfile
        fields = ('identity_document', 'bio', 'profile_picture', 'is_verified', 'average_rating')

class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = ('address', 'phone_number', 'city')

class UserDetailSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'first_name', 'last_name', 'profile')

    def get_profile(self, obj):
        if obj.role == User.Role.WORKER:
            if hasattr(obj, 'worker_profile'):
                return WorkerProfileSerializer(obj.worker_profile).data
            return None
        elif obj.role == User.Role.CLIENT:
            if hasattr(obj, 'client_profile'):
                return ClientProfileSerializer(obj.client_profile).data
            return None
        return None
