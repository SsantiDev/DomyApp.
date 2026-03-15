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
import { ClientProfile } from '../../types/auth';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileDataSection from '../../components/profile/ProfileDataSection';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { logout } = useAuth();
    const { colors, isDark } = useTheme();
    const { data: user, isLoading, isError, error, refetch } = useGetProfile();
    const updateProfile = useUpdateProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Partial<ClientProfile>>({});

    useEffect(() => {
        if (user?.profile && user.role === 'CLIENT') {
            const p = user.profile as ClientProfile;
            setForm({ address: p.address, phone_number: p.phone_number, city: p.city });
        }
    }, [user]);

    const handleFieldChange = (field: keyof ClientProfile, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        updateProfile.mutate(form, {
            onSuccess: () => {
                setIsEditing(false);
                Alert.alert('✓ Guardado', 'Tu perfil se actualizó correctamente.');
            },
            onError: () => {
                Alert.alert('Error', 'No se pudo guardar el perfil. Inténtalo de nuevo.');
            },
        });
    };

    const handleCancelEdit = () => {
        if (user?.profile && user.role === 'CLIENT') {
            const p = user.profile as ClientProfile;
            setForm({ address: p.address, phone_number: p.phone_number, city: p.city });
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
        actionBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 14,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
        },
        editBtn: {
            paddingHorizontal: 16,
            paddingVertical: 7,
            borderWidth: 1.5,
            borderColor: colors.primary,
            borderRadius: 8,
        },
        editText: {
            color: colors.primary,
            fontWeight: '600',
            fontSize: 14,
        },
        editActions: {
            flexDirection: 'row',
            gap: 8,
        },
        cancelBtn: {
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: colors.border,
        },
        cancelText: {
            color: colors.textLight,
            fontWeight: '600',
            fontSize: 14,
        },
        saveBtn: {
            paddingHorizontal: 18,
            paddingVertical: 7,
            backgroundColor: colors.primary,
            borderRadius: 8,
            minWidth: 76,
            alignItems: 'center',
        },
        saveText: {
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: 14,
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
        <SafeAreaView style={dynamicStyles.safeArea} edges={['top', 'left', 'right']}>
            <View style={dynamicStyles.actionBar}>
                <Text style={dynamicStyles.title}>Mi Perfil</Text>
                {user.role === 'CLIENT' && (
                    isEditing ? (
                        <View style={dynamicStyles.editActions}>
                            <TouchableOpacity onPress={handleCancelEdit} style={dynamicStyles.cancelBtn}>
                                <Text style={dynamicStyles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSave}
                                style={dynamicStyles.saveBtn}
                                disabled={updateProfile.isPending}
                            >
                                {updateProfile.isPending ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={dynamicStyles.saveText}>Guardar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => setIsEditing(true)} style={dynamicStyles.editBtn}>
                            <Text style={dynamicStyles.editText}>Editar</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>

            <ScrollView style={dynamicStyles.scroll} showsVerticalScrollIndicator={false}>
                <ProfileHeader user={user} />

                {user.role === 'CLIENT' && (
                    <ProfileDataSection
                        data={form}
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                    />
                )}

                <View style={dynamicStyles.logoutSection}>
                    <TouchableOpacity style={dynamicStyles.logoutButton} onPress={handleLogout}>
                        <Text style={dynamicStyles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
