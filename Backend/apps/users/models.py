from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        CLIENT = 'CLIENT', 'Client'
        WORKER = 'WORKER', 'Worker'

    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=15, choices=Role.choices, default=Role.CLIENT)
    
    # Flags de Django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    push_token = models.CharField(max_length=200, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # Solo pedirá email y password

    def __str__(self):
        return f"{self.email} ({self.role})"

class Profile(models.Model):
    """Información básica compartida"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, default='Medellín', db_index=True)

    def __str__(self):
        return f"Profile: {self.first_name} {self.last_name} ({self.user.email})"

class WorkerProfile(models.Model):
    """Datos de negocio para trabajadores"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='worker_info')
    bio = models.TextField(blank=True)
    is_available = models.BooleanField(default=False)
    average_rating = models.FloatField(default=0.0, db_index=True)
    categories = models.ManyToManyField(
        'services.Category',
        blank=True,
        related_name='workers'
    )

    def __str__(self):
        return f"Worker Detail: {self.user.email}"

class WorkerVerification(models.Model):
    """Documentos y Seguridad (Alta Sensibilidad)"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='verification')
    identity_document = models.CharField(max_length=50, unique=True, null=True, blank=True)
    document_front = models.ImageField(upload_to='verifications/', blank=True, null=True)
    document_back = models.ImageField(upload_to='verifications/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20, 
        choices=[('PENDING', 'Pendiente'), ('APPROVED', 'Aprobado'), ('REJECTED', 'Rechazado')],
        default='PENDING'
    )
    rejection_reason = models.TextField(blank=True, null=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Verification: {self.user.email} - {self.status}"

class PasswordResetCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='reset_code')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reset code for {self.user.email}"
