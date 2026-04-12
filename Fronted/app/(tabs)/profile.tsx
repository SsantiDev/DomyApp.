import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStyles } from './_profile.styles';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useGetProfile, useUpdateProfile, useUploadProfilePicture } from '../../hooks/useProfile';
import { ClientProfile } from '../../types/auth';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileDataSection from '../../components/profile/ProfileDataSection';
import { NativeMainLayout } from '../../components/layout/NativeMainLayout';

export default function ProfileScreen() {
    const { logout } = useAuth();
    const { colors, isDark } = useTheme();
    const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
    const { data: user, isLoading, isError, error, refetch } = useGetProfile();
    const updateProfile = useUpdateProfile();

    const uploadPhoto = useUploadProfilePicture();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<Partial<ClientProfile & WorkerProfile>>({});
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);

    useEffect(() => {
        if (user?.profile) {
            if (user.role === 'CLIENT') {
                const p = user.profile as ClientProfile;
                setForm({ address: p.address, phone_number: p.phone_number, city: p.city });
            } else if (user.role === 'WORKER') {
                setForm({
                    bio: user.worker_info?.bio ?? '',
                    identity_document: user.verification?.identity_document ?? '',
                });
                setSelectedCategories(user.worker_info?.categories ?? []);
            }
        }
    }, [user]);

    const handlePhotoPress = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar la foto.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (result.canceled) return;
        const uri = result.assets[0].uri;
        setLocalPhotoUri(uri);
        uploadPhoto.mutate(uri, {
            onError: () => {
                setLocalPhotoUri(null);
                Alert.alert('Error', 'No se pudo subir la foto. Intenta de nuevo.');
            },
        });
    };

    const handleFieldChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCategoryToggle = (id: number) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        if (!user) return;

        const payload = user.role === 'WORKER'
            ? { ...form, categories: selectedCategories }
            : form;

        updateProfile.mutate({ data: payload, role: user.role }, {
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
                setForm({
                    bio: user.worker_info?.bio ?? '',
                    identity_document: user.verification?.identity_document ?? '',
                });
                setSelectedCategories(user.worker_info?.categories ?? []);
            }
        }
        setLocalPhotoUri(null);
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
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Cargando perfil…</Text>
            </View>
        );
    }

    if (isError || !user) {
        const errorMessage = (error as any)?.message || 'No se pudo cargar tu perfil.';
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <NativeMainLayout>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <ProfileHeader
                    user={user}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                    isSaving={updateProfile.isPending}
                    onPhotoPress={handlePhotoPress}
                    localPhotoUri={localPhotoUri}
                />

                <ProfileDataSection
                    data={form}
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                    role={user.role as 'CLIENT' | 'WORKER'}
                    selectedCategories={selectedCategories}
                    onCategoryToggle={handleCategoryToggle}
                />

                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </NativeMainLayout>
    );
}
