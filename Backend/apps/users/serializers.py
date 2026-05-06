from rest_framework import serializers
from .models import User, Profile, WorkerProfile, WorkerVerification, UserAddress, FavoriteWorker
from apps.services.models import Category

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'phone_number', 'profile_picture', 'address', 'city')

class WorkerProfileSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Category.objects.all()
    )

    class Meta:
        model = WorkerProfile
        fields = ('bio', 'is_available', 'average_rating', 'categories')
        read_only_fields = ('average_rating',)

class WorkerVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerVerification
        fields = ('identity_document', 'document_front', 'document_back', 'is_verified', 'status', 'rejection_reason', 'verified_at')
        read_only_fields = ('is_verified', 'status', 'rejection_reason', 'verified_at')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'role')

class UserDetailSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    worker_info = WorkerProfileSerializer(required=False)
    verification = WorkerVerificationSerializer(required=False)

    class Meta:
        model = User
        fields = ('id', 'email', 'role', 'profile', 'worker_info', 'verification')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # Include profile fields in registration if needed, or keep it simple
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'role', 'first_name', 'last_name')

    def create(self, validated_data):
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        user = User.objects.create_user(**validated_data)
        
        # Profile is created in signals, but we can update names here
        if hasattr(user, 'profile'):
            user.profile.first_name = first_name
            user.profile.last_name = last_name
            user.profile.save()
        
        return user

class UserAdminDetailSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ('id', 'email', 'role', 'profile')

class WorkerAdminDetailSerializer(serializers.ModelSerializer):
    user = UserAdminDetailSerializer(read_only=True)
    verification = WorkerVerificationSerializer(read_only=True)
    
    class Meta:
        model = WorkerProfile
        fields = ('id', 'user', 'bio', 'is_available', 'average_rating', 'verification')

class AdminUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='profile.first_name', read_only=True)
    last_name = serializers.CharField(source='profile.last_name', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined')
        read_only_fields = ('id', 'email', 'first_name', 'last_name', 'date_joined')

class WorkerReviewSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()

    class Meta:
        from apps.services.models import Review
        model = Review
        fields = ['id', 'rating', 'comment', 'client_name', 'created_at']

    def get_client_name(self, obj):
        client = obj.service_request.client
        profile = getattr(client, 'profile', None)
        if profile:
            return f"{profile.first_name} {profile.last_name}".strip()
        return client.email

class WorkerListSerializer(serializers.ModelSerializer):
    """Lite serializer for public search/listing"""
    first_name = serializers.CharField(source='user.profile.first_name')
    last_name = serializers.CharField(source='user.profile.last_name')
    city = serializers.CharField(source='user.profile.city')
    email = serializers.EmailField(source='user.email')
    categories = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    profile_picture = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = WorkerProfile
        fields = ('id', 'email', 'first_name', 'last_name', 'city', 'bio', 'is_available', 'average_rating', 'categories', 'profile_picture', 'reviews')

    def get_profile_picture(self, obj):
        profile = getattr(obj.user, 'profile', None)
        if profile and profile.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(profile.profile_picture.url)
            return profile.profile_picture.url
        return None

    def get_reviews(self, obj):
        from apps.services.models import Review
        reviews = Review.objects.filter(service_request__worker=obj.user).order_by('-created_at')
        return WorkerReviewSerializer(reviews, many=True, context=self.context).data


class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = ('id', 'alias', 'address_line', 'latitude', 'longitude', 'is_default')

    def validate(self, attrs):
        # Enforce single default: if setting is_default=True, unset others
        if attrs.get('is_default'):
            request = self.context.get('request')
            if request:
                qs = UserAddress.objects.filter(user=request.user, is_default=True)
                if self.instance:
                    qs = qs.exclude(pk=self.instance.pk)
                qs.update(is_default=False)
        return attrs


class FavoriteWorkerSerializer(serializers.ModelSerializer):
    worker_id = serializers.IntegerField(source='worker.id', read_only=True)
    name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    avg_rating = serializers.FloatField(source='worker.worker_info.average_rating', read_only=True)

    class Meta:
        model = FavoriteWorker
        fields = ('id', 'worker_id', 'name', 'avatar_url', 'avg_rating', 'created_at')
        read_only_fields = ('id', 'worker_id', 'name', 'avatar_url', 'avg_rating', 'created_at')

    def get_name(self, obj):
        profile = getattr(obj.worker, 'profile', None)
        if profile:
            return f"{profile.first_name} {profile.last_name}".strip()
        return obj.worker.email

    def get_avatar_url(self, obj):
        profile = getattr(obj.worker, 'profile', None)
        if profile and profile.profile_picture:
            request = self.context.get('request')
            return request.build_absolute_uri(profile.profile_picture.url) if request else None
        return None
