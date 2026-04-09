import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/NativeCard';
import { Button } from '../components/ui/NativeButton';
import { useAdminPendingVerifications, useProcessVerification } from '../hooks/useAdmin';
import { Shield, Users, Clock, ChevronRight, X } from 'lucide-react-native';
import { SPACING } from '../constants/theme';
import { API_URL } from '../config/env';
import { AppHeader } from '../components/layout/AppHeader';
import { NativeMainLayout } from '../components/layout/NativeMainLayout';
import { getStyles } from './admin-dashboard.styles';

import { AdminDashboard as ServiceTracking } from '../components/dashboard/AdminDashboard';

export default function AdminDashboard() {
    const { colors } = useTheme();
    const router = useRouter();
    const { data: pending, isLoading, refetch } = useAdminPendingVerifications();
    const processMutation = useProcessVerification();
    const [selectedWorker, setSelectedWorker] = React.useState<any>(null);
    const [rejectionReason, setRejectionReason] = React.useState('');
    const [showRejectModal, setShowRejectModal] = React.useState(false);
    const [activeView, setActiveView] = React.useState<'SERVICES' | 'VERIFICATIONS'>('SERVICES');

    const handleAction = async (pk: number, action: 'approve' | 'reject', reason: string = '') => {
        try {
            await processMutation.mutateAsync({ pk, action, reason });
            Alert.alert('Éxito', `Operaria ${action === 'approve' ? 'aprobada' : 'rechazada'} correctamente.`);
            setSelectedWorker(null);
            setShowRejectModal(false);
            setRejectionReason('');
        } catch (error) {
            Alert.alert('Error', 'No se pudo completar la acción.');
        }
    };

    const getFullUri = (path: string) => {
        if (!path) return undefined;
        if (path.startsWith('http')) return path;
        return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const styles = useMemo(() => getStyles(colors), [colors]);

    if (isLoading && activeView === 'VERIFICATIONS') {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NativeMainLayout>
            <AppHeader />
            <View style={{ flexDirection: 'row', padding: 10, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <TouchableOpacity 
                    style={{ flex: 1, padding: 12, alignItems: 'center', borderBottomWidth: activeView === 'SERVICES' ? 2 : 0, borderBottomColor: colors.primary }}
                    onPress={() => setActiveView('SERVICES')}
                >
                    <Text style={{ fontWeight: activeView === 'SERVICES' ? 'bold' : 'normal', color: activeView === 'SERVICES' ? colors.primary : colors.textMuted }}>Seguimiento Central</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ flex: 1, padding: 12, alignItems: 'center', borderBottomWidth: activeView === 'VERIFICATIONS' ? 2 : 0, borderBottomColor: colors.primary }}
                    onPress={() => setActiveView('VERIFICATIONS')}
                >
                    <Text style={{ fontWeight: activeView === 'VERIFICATIONS' ? 'bold' : 'normal', color: activeView === 'VERIFICATIONS' ? colors.primary : colors.textMuted }}>Verificar Identidades</Text>
                </TouchableOpacity>
            </View>

            {activeView === 'SERVICES' ? (
                <ServiceTracking />
            ) : (
                <View style={styles.container}>
                    <View style={{ padding: SPACING.lg, paddingBottom: 0 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <Shield size={28} color={colors.primary} />
                            <View>
                                <Text style={styles.title}>Panel Admin</Text>
                                <Text style={styles.subtitle}>Gestión de Verificaciones</Text>
                            </View>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.sectionTitle}>Solicitudes Pendientes ({pending?.length || 0})</Text>

                        {pending?.length === 0 ? (
                            <View style={{ alignItems: 'center', marginTop: 40 }}>
                                <Clock size={60} color={colors.textMuted} strokeWidth={1} />
                                <Text style={{ marginTop: 16, color: colors.textLight, fontWeight: '600' }}>No hay verificaciones pendientes</Text>
                            </View>
                        ) : (
                            pending?.map((item: any) => (
                                <TouchableOpacity key={item.id} onPress={() => setSelectedWorker(item)}>
                                    <Card style={styles.workerCard}>
                                        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + '10', alignItems: 'center', justifyContent: 'center' }}>
                                            <Users size={20} color={colors.primary} />
                                        </View>
                                        <View style={styles.workerInfo}>
                                            <Text style={styles.workerName}>{item.user.first_name} {item.user.last_name}</Text>
                                            <Text style={styles.workerEmail}>{item.user.email}</Text>
                                        </View>
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>Pendiente</Text>
                                        </View>
                                        <ChevronRight size={18} color={colors.textLight} />
                                    </Card>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>

                    {/* Review Modal */}
                    <Modal visible={!!selectedWorker && !showRejectModal} transparent animationType="slide">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <View>
                                        <Text style={styles.modalTitle}>Verificar Documentos</Text>
                                        <Text style={{ color: colors.textLight, fontSize: 12 }}>ID: {selectedWorker?.identity_document}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setSelectedWorker(null)}>
                                        <X size={24} color={colors.textLight} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>
                                            {selectedWorker?.user.first_name} {selectedWorker?.user.last_name}
                                        </Text>
                                        <Text style={{ color: colors.textLight, fontSize: 14 }}>{selectedWorker?.user.email}</Text>
                                    </View>

                                    <View style={styles.docCard}>
                                        <Text style={styles.docLabel}>Foto Frontal</Text>
                                        <Image
                                            source={{ uri: getFullUri(selectedWorker?.document_front) }}
                                            style={styles.docImage}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    <View style={styles.docCard}>
                                        <Text style={styles.docLabel}>Foto Posterior</Text>
                                        <Image
                                            source={{ uri: getFullUri(selectedWorker?.document_back) }}
                                            style={styles.docImage}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    <View style={{ height: 20 }} />
                                </ScrollView>

                                <View style={{ flexDirection: 'row', gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: colors.border }}>
                                    <Button
                                        title="Rechazar"
                                        variant="outline"
                                        style={{ flex: 1, borderColor: colors.danger }}
                                        textStyle={{ color: colors.danger, fontWeight: '700' }}
                                        onPress={() => setShowRejectModal(true)}
                                    />
                                    <Button
                                        title="Aprobar"
                                        style={{ flex: 1, backgroundColor: colors.success }}
                                        textStyle={{ fontWeight: '700' }}
                                        onPress={() => handleAction(selectedWorker.id, 'approve')}
                                        loading={processMutation.isPending}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Rejection Modal */}
                    <Modal visible={showRejectModal} transparent animationType="fade">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Motivo del Rechazo</Text>
                                <Text style={{ color: colors.textLight, marginBottom: 12 }}>Escribe por qué no se aprobó el documento para informar a la operaria.</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Foto borrosa, Documento vencido..."
                                    placeholderTextColor={colors.textMuted}
                                    multiline
                                    value={rejectionReason}
                                    onChangeText={setRejectionReason}
                                />

                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <Button
                                        title="Cancelar"
                                        variant="outline"
                                        onPress={() => setShowRejectModal(false)}
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        title="Confirmar Rechazo"
                                        style={{ flex: 1, backgroundColor: colors.danger }}
                                        onPress={() => handleAction(selectedWorker.id, 'reject', rejectionReason)}
                                        loading={processMutation.isPending}
                                        disabled={!rejectionReason.trim()}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </NativeMainLayout>
    );
}
