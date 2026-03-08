import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useGetProfile, useUpdateProfile } from '../../hooks/useProfile';
import { ClientProfile } from '../../types/auth';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileDataSection from '../../components/profile/ProfileDataSection';

export default function ProfileScreen() {
    const { logout } = useAuth();
    const { data: user, isLoading, isError, refetch } = useGetProfile();
    const updateProfile = useUpdateProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Partial<ClientProfile>>({});

    // Sync form when profile data loads
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
        // Reset form back to original data
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

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4CAF93" />
                <Text style={styles.loadingText}>Cargando perfil…</Text>
            </View>
        );
    }

    if (isError || !user) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>No se pudo cargar tu perfil.</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header action bar */}
            <View style={styles.actionBar}>
                <Text style={styles.title}>Mi Perfil</Text>
                {user.role === 'CLIENT' && (
                    isEditing ? (
                        <View style={styles.editActions}>
                            <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelBtn}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSave}
                                style={styles.saveBtn}
                                disabled={updateProfile.isPending}
                            >
                                {updateProfile.isPending ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.saveText}>Guardar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
                            <Text style={styles.editText}>Editar</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <ProfileHeader user={user} />

                {user.role === 'CLIENT' && (
                    <ProfileDataSection
                        data={form}
                        isEditing={isEditing}
                        onChange={handleFieldChange}
                    />
                )}

                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scroll: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        gap: 12,
    },
    loadingText: {
        color: '#6B7280',
        fontSize: 15,
        marginTop: 8,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: '#4CAF93',
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
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    editBtn: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderWidth: 1.5,
        borderColor: '#4CAF93',
        borderRadius: 8,
    },
    editText: {
        color: '#4CAF93',
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
        borderColor: '#D1D5DB',
    },
    cancelText: {
        color: '#6B7280',
        fontWeight: '600',
        fontSize: 14,
    },
    saveBtn: {
        paddingHorizontal: 18,
        paddingVertical: 7,
        backgroundColor: '#4CAF93',
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
        backgroundColor: '#FEF2F2',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 16,
    },
});
