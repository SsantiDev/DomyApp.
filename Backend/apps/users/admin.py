from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, WorkerProfile, ClientProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('role', 'email')}),
    )
    ordering = ('email',)

@admin.register(WorkerProfile)
class WorkerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'identity_document', 'is_verified', 'average_rating')
    list_filter = ('is_verified',)
    search_fields = ('user__email', 'identity_document')
    readonly_fields = ('average_rating',)

@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'city', 'phone_number')
    search_fields = ('user__email', 'city')
