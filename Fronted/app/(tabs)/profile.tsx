import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useGetProfile, useUpdateProfile } from '../../hooks/useProfile';
import { ClientProfile, WorkerProfile } from '../../types/auth';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileDataSection from '../../components/profile/ProfileDataSection';
import { NativeMainLayout } from '../../components/layout/NativeMainLayout';

export default function ProfileScreen() {
    const { logout } = useAuth();
    const { colors, isDark } = useTheme();
    const { data: user, isLoading, isError, error, refetch } = useGetProfile();
    const updateProfile = useUpdateProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Partial<ClientProfile & WorkerProfile>>({});

    useEffect(() => {
        if (user?.profile) {
            if (user.role === 'CLIENT') {
                const p = user.profile as ClientProfile;
                setForm({ address: p.address, phone_number: p.phone_number, city: p.city });
            } else if (user.role === 'WORKER') {
                const p = user.profile as WorkerProfile;
                setForm({ bio: p.bio, identity_document: p.identity_document });
            }
        }
    }, [user]);

    const handleFieldChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!user) return;

        updateProfile.mutate({ data: form, role: user.role }, {
            onSuccess: () => {
                setIsEditing(false);
                Alert.alert('✓ Guardado', 'Tu perfil se actualizó correctamente.');
            },
            onError: (err: any) => {
                const msg = err.response?.data?.error || 'No se pudo guardar el perfil.';
                Alert.alert('Error', msg);
            },
        });
    };

    const handleCancelEdit = () => {
        if (user?.profile) {
            if (user.role === 'CLIENT') {
                const p = user.profile as ClientProfile;
                setForm({ address: p.address, phone_number: p.phone_number, city: p.city });
            } else if (user.role === 'WORKER') {
                const p = user.profile as WorkerProfile;
                setForm({ bio: p.bio, identity_document: p.identity_document });
            }
        }
        setIsEditing(false);
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que quieres salir?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Salir', style: 'destructive', onPress: logout },
            ]
        );
    };

    const dynamicStyles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scroll: {
            flex: 1,
        },
        centered: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
            gap: 12,
        },
        loadingText: {
            color: colors.textLight,
            fontSize: 15,
            marginTop: 8,
        },
        errorText: {
            color: colors.danger,
            fontSize: 16,
            fontWeight: '500',
            marginBottom: 12,
        },
        retryButton: {
            paddingHorizontal: 24,
            paddingVertical: 10,
            backgroundColor: colors.primary,
            borderRadius: 8,
        },
        retryText: {
            color: '#FFF',
            fontWeight: '600',
        },
        email: {
            fontSize: 14,
            color: colors.textLight,
            marginBottom: 12,
        },
        logoutSection: {
            padding: 24,
            marginTop: 8,
        },
        logoutButton: {
            backgroundColor: isDark ? `${colors.danger}22` : '#FEF2F2',
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: isDark ? colors.danger : '#FECACA',
        },
        logoutText: {
            color: colors.danger,
            fontWeight: '700',
            fontSize: 16,
        },
    });

    if (isLoading) {
        return (
            <View style={dynamicStyles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={dynamicStyles.loadingText}>Cargando perfil…</Text>
            </View>
        );
    }

    if (isError || !user) {
        const errorMessage = (error as any)?.message || 'No se pudo cargar tu perfil.';
        return (
            <View style={dynamicStyles.centered}>
                <Text style={dynamicStyles.errorText}>{errorMessage}</Text>
                <TouchableOpacity style={dynamicStyles.retryButton} onPress={() => refetch()}>
                    <Text style={dynamicStyles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <NativeMainLayout>
            <ScrollView style={dynamicStyles.scroll} showsVerticalScrollIndicator={false}>
                <ProfileHeader
                    user={user}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                    isSaving={updateProfile.isPending}
                />

                <ProfileDataSection
                    data={form}
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                />

                <View style={dynamicStyles.logoutSection}>
                    <TouchableOpacity style={dynamicStyles.logoutButton} onPress={handleLogout}>
                        <Text style={dynamicStyles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </NativeMainLayout>
    );
}
