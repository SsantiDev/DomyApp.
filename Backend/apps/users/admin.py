from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Profile, WorkerProfile, WorkerVerification

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'role', 'password', 'is_active', 'is_staff'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name', 'city', 'phone_number')
    search_fields = ('user__email', 'first_name', 'last_name', 'city')

@admin.register(WorkerProfile)
class WorkerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_available', 'average_rating')
    list_filter = ('is_available',)
    readonly_fields = ('average_rating',)

@admin.register(WorkerVerification)
class WorkerVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'identity_document', 'status', 'is_verified', 'front_preview', 'back_preview')
    list_filter = ('status', 'is_verified')
    search_fields = ('user__email', 'identity_document')
    readonly_fields = ('front_preview', 'back_preview', 'verified_at')

    def front_preview(self, obj):
        if obj.document_front:
            return format_html('<a href="{}" target="_blank"><img src="{}" style="max-height:120px;max-width:180px;" /></a>', obj.document_front.url, obj.document_front.url)
        return '—'
    front_preview.short_description = 'Frente'

    def back_preview(self, obj):
        if obj.document_back:
            return format_html('<a href="{}" target="_blank"><img src="{}" style="max-height:120px;max-width:180px;" /></a>', obj.document_back.url, obj.document_back.url)
        return '—'
    back_preview.short_description = 'Reverso'
