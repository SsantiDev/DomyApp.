from rest_framework import serializers
from .models import User, WorkerProfile, ClientProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'first_name', 'last_name')

class WorkerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerProfile
        fields = (
            'identity_document', 'bio', 'profile_picture', 
            'is_verified', 'verification_status', 'document_front', 
            'document_back', 'rejection_reason', 'verified_at',
            'is_available', 'average_rating'
        )
        read_only_fields = ('is_verified', 'verification_status', 'rejection_reason', 'verified_at', 'average_rating')

class WorkerVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerProfile
        fields = ('identity_document', 'document_front', 'document_back')
        extra_kwargs = {
            'identity_document': {'required': True},
            'document_front': {'required': True},
            'document_back': {'required': True},
        }

    def update(self, instance, validated_data):
        # When documents are uploaded, set status to PENDING
        instance.verification_status = WorkerProfile.VerificationStatus.PENDING
        return super().update(instance, validated_data)

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

class UserAdminDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name')

class WorkerAdminDetailSerializer(serializers.ModelSerializer):
    user = UserAdminDetailSerializer(read_only=True)
    
    class Meta:
        model = WorkerProfile
        fields = (
            'id', 'user', 'identity_document', 'verification_status', 
            'document_front', 'document_back', 'verified_at', 'rejection_reason'
        )
