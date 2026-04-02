import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Platform,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
    useGetServiceDetail,
    useStartService,
    useCompleteService,
    useRateService
} from '../../hooks/useServices';
import { useReportIncident, useGetServiceIncidents } from '../../hooks/useSupport';
import { IncidentType, INCIDENT_TYPE_LABELS } from '../../types/support';
import { NativeMainLayout } from '../../components/layout/NativeMainLayout';
import { Card } from '../../components/ui/NativeCard';
import { Button } from '../../components/ui/NativeButton';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import {
    MapPin,
    Clock,
    Calendar,
    User,
    Briefcase,
    ChevronLeft,
    Navigation,
    Star,
    Send,
    CheckCircle,
    ShieldAlert
} from 'lucide-react-native';

export default function ServiceDetailScreen() {
    const { id } = useLocalSearchParams();
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const { data: service, isLoading, isError, refetch } = useGetServiceDetail(Number(id));

    // Mutations
    const startService = useStartService();
    const completeService = useCompleteService();
    const rateService = useRateService();
    const reportIncident = useReportIncident();
    const { data: incidents } = useGetServiceIncidents(Number(id));
    const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

    // Rating State
    const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    // Incident State
    const [isIncidentModalVisible, setIsIncidentModalVisible] = useState(false);
    const [incidentType, setIncidentType] = useState<IncidentType>('OTHER');
    const [incidentDescription, setIncidentDescription] = useState('');

    if (isLoading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (isError || !service) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.danger }}>No se encontró el servicio.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: colors.primary }}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isWorker = user?.role === 'WORKER';
    const isClient = user?.role === 'CLIENT';
    const canRate = isClient && service.status === 'COMPLETED' && !service.review;

    // Map Coordinates
    const destCoords = {
        latitude: service.latitude ? Number(service.latitude) : 6.2442,
        longitude: service.longitude ? Number(service.longitude) : -75.5812,
    };

    const handleOpenNavigation = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${destCoords.latitude},${destCoords.longitude}`;
        const label = 'Destino del Servicio';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });
        if (url) Linking.openURL(url);
    };

    const handleStart = async () => {
        try {
            await startService.mutateAsync(Number(id));
            Alert.alert('¡Excelente!', 'Has iniciado el servicio. ¡Buen trabajo!');
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'No se pudo iniciar la labor');
        }
    };

    const handleComplete = async () => {
        try {
            await completeService.mutateAsync(Number(id));
            Alert.alert('¡Felicitaciones!', 'Has completado el servicio correctamente.');
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'No se pudo finalizar la labor');
        }
    };

    const handleRate = async () => {
        if (rating === 0) {
            Alert.alert('Atención', 'Por favor selecciona una calificación.');
            return;
        }
        try {
            await rateService.mutateAsync({ id: Number(id), rating, comment });
            setIsRatingModalVisible(false);
            Alert.alert('¡Gracias!', 'Tu calificación nos ayuda a profesionalizar el servicio.');
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'No se pudo enviar la calificación.');
        }
    };

    const handleReportIncident = async () => {
        if (!incidentDescription.trim()) {
            Alert.alert('Error', 'Por favor describe lo sucedido');
            return;
        }

        try {
            await reportIncident.mutateAsync({
                service_request: Number(id),
                incident_type: incidentType,
                description: incidentDescription
            });
            setIsIncidentModalVisible(false);
            setIncidentDescription('');
            Alert.alert('Reporte Enviado', 'Domy revisará el incidente y se pondrá en contacto pronto.');
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'No se pudo enviar el reporte');
        }
    };

    return (
        <NativeMainLayout>
            <Stack.Screen
                options={{
                    title: 'Seguimiento de Labor',
                    headerTitleStyle: {
                        fontWeight: '800',
                        fontSize: 18,
                    },
                }}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Map View Placeholder (react-native-maps not supported on web) */}
                <View style={[styles.mapContainer, { borderColor: colors.border, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 12 }]}>
                    <View style={{ alignItems: 'center', gap: 8 }}>
                        <MapPin size={40} color={colors.primary} />
                        <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16, textAlign: 'center', paddingHorizontal: 16 }}>
                            {service.address}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.navBtn, { backgroundColor: colors.primary, position: 'relative', bottom: 'auto', right: 'auto' }]}
                        onPress={handleOpenNavigation}
                    >
                        <Navigation size={20} color="#ffffff" />
                        <Text style={styles.navBtnText}>Abrir en Mapa</Text>
                    </TouchableOpacity>
                </View>

                {/* Status Section */}
                <View style={styles.statusSection}>
                    <Card variant="flat" style={styles.statusCard}>
                        <View style={styles.statusHeader}>
                            <View>
                                <Text style={[styles.statusLabel, { color: colors.textLight }]}>Estado de la Labor</Text>
                                <Text style={[styles.statusValueText, { color: colors.text }]}>
                                    {service.status === 'ACCEPTED' ? 'Programada' :
                                        service.status === 'IN_PROGRESS' ? 'En ejecución' :
                                            service.status === 'COMPLETED' ? 'Finalizada con éxito' : service.status}
                                </Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: service.status === 'COMPLETED' ? colors.success + '15' : colors.primary + '10' }]}>
                                <View style={[styles.dot, { backgroundColor: service.status === 'COMPLETED' ? colors.success : colors.primary }]} />
                                <Text style={[styles.badgeText, { color: service.status === 'COMPLETED' ? colors.success : colors.primary }]}>
                                    {service.status}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Actions for Worker */}
                {isWorker && (
                    <View style={styles.actionsContainer}>
                        {service.status === 'ACCEPTED' && (
                            <Button
                                title="Iniciar Labor"
                                onPress={handleStart}
                                loading={startService.isPending}
                                icon={<Clock size={20} color="#ffffff" />}
                            />
                        )}
                        {service.status === 'IN_PROGRESS' && (
                            <Button
                                title="Finalizar Labor"
                                onPress={handleComplete}
                                style={{ backgroundColor: colors.success }}
                                loading={completeService.isPending}
                                icon={<CheckCircle size={20} color="#ffffff" />}
                            />
                        )}
                    </View>
                )}

                {/* Rating Button for Client */}
                {canRate && (
                    <View style={styles.actionsContainer}>
                        <Button
                            title="Calificar Labor"
                            onPress={() => setIsRatingModalVisible(true)}
                            variant="outline"
                            icon={<Star size={20} color={colors.primary} />}
                        />
                    </View>
                )}

                {/* Info Cards */}
                <View style={styles.infoSection}>
                    <Card variant="flat" style={styles.infoCard}>
                        <View style={styles.sectionHeader}>
                            <Briefcase size={20} color={colors.primary} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Servicio</Text>
                        </View>
                        <Text style={[styles.categoryTitle, { color: colors.text }]}>{service.category_name}</Text>
                        <View style={styles.row}>
                            <Clock size={16} color={colors.textLight} />
                            <Text style={[styles.detailText, { color: colors.textLight }]}>
                                {new Date(service.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Calendar size={16} color={colors.textLight} />
                            <Text style={[styles.detailText, { color: colors.textLight }]}>
                                {new Date(service.scheduled_at).toLocaleDateString()}
                            </Text>
                        </View>
                    </Card>

                    <Card variant="flat" style={styles.infoCard}>
                        <View style={styles.sectionHeader}>
                            <MapPin size={20} color={colors.primary} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ubicación</Text>
                        </View>
                        <Text style={[styles.addressText, { color: colors.text }]}>{service.address}</Text>
                    </Card>

                    <Card variant="flat" style={styles.infoCard}>
                        <View style={styles.sectionHeader}>
                            <User size={20} color={colors.primary} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cliente</Text>
                        </View>
                        <Text style={[styles.clientName, { color: colors.text }]}>{service.client_email}</Text>
                        {service.details && (
                            <View style={styles.detailsBox}>
                                <Text style={[styles.detailsLabel, { color: colors.textLight }]}>Instrucciones:</Text>
                                <Text style={[styles.detailsText, { color: colors.text }]}>{service.details}</Text>
                            </View>
                        )}
                    </Card>

                    {/* Incident Display */}
                    {incidents && incidents.length > 0 && (
                        <Card variant="flat" style={[styles.infoCard, { borderTopWidth: 2, borderTopColor: colors.danger + '40' }]}>
                            <View style={styles.sectionHeader}>
                                <ShieldAlert size={20} color={colors.danger} />
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Reporte de Incidencias</Text>
                            </View>
                            {incidents.map((inc) => (
                                <View key={inc.id} style={styles.incidentItem}>
                                    <View style={styles.incidentHeader}>
                                        <Text style={[styles.incidentType, { color: colors.text }]}>
                                            {INCIDENT_TYPE_LABELS[inc.incident_type]}
                                        </Text>
                                        <View style={[styles.miniBadge, { backgroundColor: colors.warning + '15' }]}>
                                            <Text style={[styles.miniBadgeText, { color: colors.warning }]}>
                                                {inc.status === 'OPEN' ? 'En espera' : 'Revisado'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.incidentText, { color: colors.textLight }]}>{inc.description}</Text>
                                </View>
                            ))}
                        </Card>
                    )}

                    {/* Report Button */}
                    <TouchableOpacity
                        style={styles.inlineButton}
                        onPress={() => setIsIncidentModalVisible(true)}
                    >
                        <ShieldAlert size={16} color={colors.textMuted} />
                        <Text style={[styles.inlineButtonText, { color: colors.textMuted }]}>Reportar un problema</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerSpace} />
            </ScrollView>

            {/* Incident Report Modal */}
            <Modal
                visible={isIncidentModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsIncidentModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={[styles.ratingModal, { backgroundColor: colors.background }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Reportar incidencia</Text>
                        <Text style={[styles.modalSubtitle, { color: colors.textLight }]}>
                            Cuéntanos qué sucedió para que Domy pueda asistirte.
                        </Text>

                        <Text style={[styles.label, { color: colors.text, marginBottom: 8 }]}>Tipo de problema</Text>
                        <View style={styles.typeSelector}>
                            {(Object.keys(INCIDENT_TYPE_LABELS) as IncidentType[]).map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.typeOption,
                                        {
                                            borderColor: incidentType === type ? colors.primary : colors.border,
                                            backgroundColor: incidentType === type ? colors.primary + '10' : 'transparent'
                                        }
                                    ]}
                                    onPress={() => setIncidentType(type)}
                                >
                                    <Text style={[
                                        styles.typeOptionText,
                                        { color: incidentType === type ? colors.primary : colors.textLight }
                                    ]}>
                                        {INCIDENT_TYPE_LABELS[type]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={[styles.commentInput, {
                                borderColor: colors.border,
                                color: colors.text,
                                backgroundColor: colors.surface,
                                marginTop: SPACING.md
                            }]}
                            placeholder="Describe detalladamente el incidente..."
                            placeholderTextColor={colors.textLight}
                            multiline
                            numberOfLines={4}
                            value={incidentDescription}
                            onChangeText={setIncidentDescription}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: colors.surface }]}
                                onPress={() => setIsIncidentModalVisible(false)}
                            >
                                <Text style={[styles.modalBtnText, { color: colors.textLight }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: colors.danger }]}
                                onPress={handleReportIncident}
                                disabled={reportIncident.isPending}
                            >
                                <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Enviar Reporte</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>
            </Modal>

            {/* Rating Modal */}
            <Modal
                visible={isRatingModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsRatingModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={[styles.ratingModal, { backgroundColor: colors.background }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>¿Cómo fue tu experiencia?</Text>
                        <Text style={[styles.modalSubtitle, { color: colors.textLight }]}>
                            Califica el servicio de {service.category_name} para ayudarnos a mejorar.
                        </Text>

                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                    <Star
                                        size={40}
                                        color={s <= rating ? colors.warning : colors.border}
                                        fill={s <= rating ? colors.warning : 'transparent'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={[styles.commentInput, {
                                borderColor: colors.border,
                                color: colors.text,
                                backgroundColor: colors.surface
                            }]}
                            placeholder="Escribe un comentario opcional..."
                            placeholderTextColor={colors.textLight}
                            multiline
                            numberOfLines={4}
                            value={comment}
                            onChangeText={setComment}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: colors.border }]}
                                onPress={() => setIsRatingModalVisible(false)}
                            >
                                <Text style={[styles.cancelBtnText, { color: colors.textLight }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                                onPress={handleRate}
                            >
                                <Send size={20} color="#ffffff" />
                                <Text style={styles.submitBtnText}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>
            </Modal>
        </NativeMainLayout>
    );
}

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        display: 'none', // Removed as we use Stack header
    },
    statusValueText: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    content: {
        flex: 1,
    },
    mapContainer: {
        height: 220,
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: colors.surface,
    },
    map: {
        flex: 1,
    },
    navBtn: {
        position: 'absolute',
        bottom: SPACING.md,
        right: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderRadius: RADIUS.full,
        gap: SPACING.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    navBtnText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 14,
    },
    marker: {
        padding: SPACING.sm,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    statusSection: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.md,
    },
    statusCard: {
        padding: SPACING.md,
        backgroundColor: 'transparent', // Card already sets surface color
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: RADIUS.full,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    actionsContainer: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
    },
    infoSection: {
        padding: SPACING.lg,
        gap: SPACING.lg,
    },
    infoCard: {
        padding: SPACING.xl,
        borderRadius: RADIUS.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.smd,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    categoryTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.xs,
    },
    detailText: {
        fontSize: 15,
        fontWeight: '500',
    },
    addressText: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '700',
    },
    detailsBox: {
        marginTop: SPACING.smd,
        padding: SPACING.smd,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: RADIUS.md,
    },
    detailsLabel: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: SPACING.xs,
    },
    detailsText: {
        fontSize: 14,
        lineHeight: 20,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: SPACING.xs,
        marginBottom: SPACING.sm,
    },
    reviewComment: {
        marginTop: SPACING.sm,
        padding: SPACING.smd,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: RADIUS.md,
        fontStyle: 'italic',
    },
    commentText: {
        fontSize: 15,
        lineHeight: 22,
    },
    footerSpace: {
        height: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    ratingModal: {
        padding: SPACING.xl,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        lineHeight: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: SPACING.smd,
        marginBottom: SPACING.lg,
    },
    commentInput: {
        width: '100%',
        borderWidth: 1,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        height: 120,
        textAlignVertical: 'top',
        fontSize: 15,
        marginBottom: SPACING.lg,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: SPACING.smd,
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    incidentItem: {
        marginTop: SPACING.smd,
        paddingTop: SPACING.smd,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    incidentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    incidentType: {
        fontSize: 14,
        fontWeight: '700',
    },
    incidentText: {
        fontSize: 14,
        lineHeight: 20,
    },
    miniBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: 10,
    },
    miniBadgeText: {
        fontSize: 10,
        fontWeight: '800',
    },
    inlineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.md,
        marginTop: SPACING.sm,
    },
    inlineButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
    },
    typeSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    typeOption: {
        paddingHorizontal: SPACING.smd,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1,
    },
    typeOptionText: {
        fontSize: 13,
        fontWeight: '600',
    },
    submitBtn: {
        flex: 2,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    submitBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
    },
    modalBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalBtn: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
