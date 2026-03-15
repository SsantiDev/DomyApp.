from rest_framework import serializers
from .models import User, WorkerProfile, ClientProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'first_name', 'last_name')

class WorkerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerProfile
        fields = ('identity_document', 'bio', 'profile_picture', 'is_verified', 'is_available', 'average_rating')

class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = ('address', 'phone_number', 'city')

class ClientProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = ('address', 'phone_number', 'city')
        extra_kwargs = {
            'address': {'required': False},
            'phone_number': {'required': False},
            'city': {'required': False},
        }

class WorkerProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerProfile
        fields = ('identity_document', 'bio')
        extra_kwargs = {
            'identity_document': {'required': False},
            'bio': {'required': False},
        }

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

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
