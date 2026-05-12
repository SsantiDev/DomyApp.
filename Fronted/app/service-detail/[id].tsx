import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Platform,
    Alert,
} from 'react-native';

import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
    useGetServiceDetail,
    useStartService,
    useCompleteService,
    useRateService,
    useCancelService,
    useRescheduleService
} from '../../hooks/useServices';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useReportIncident, useGetServiceIncidents } from '../../hooks/useSupport';
import { IncidentType } from '../../types/support';
import { NativeMainLayout } from '../../components/layout/NativeMainLayout';
import { MapSection } from '../../components/service-detail/MapSection';
import { StatusSection } from '../../components/service-detail/StatusSection';
import { WorkerActions } from '../../components/service-detail/WorkerActions';
import { ClientActions } from '../../components/service-detail/ClientActions';
import { RatingSection } from '../../components/service-detail/RatingSection';
import { InfoSection } from '../../components/service-detail/InfoSection';
import { IncidentModal } from '../../components/service-detail/IncidentModal';
import { RatingModal } from '../../components/service-detail/RatingModal';
import { getStyles } from '../../styles/service-detail.styles';

export default function ServiceDetailScreen() {
    const { id } = useLocalSearchParams();
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const { data: service, isLoading, isError, refetch } = useGetServiceDetail(Number(id));

    // Mutations
    const startService = useStartService();
    const completeService = useCompleteService();
    const cancelService = useCancelService();
    const rescheduleService = useRescheduleService();
    const rateService = useRateService();
    const reportIncident = useReportIncident();
    const { data: incidents } = useGetServiceIncidents(Number(id));
    const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

    // Reschedule State
    const [rescheduleDate, setRescheduleDate] = useState(new Date());
    const [showReschedulePicker, setShowReschedulePicker] = useState(false);
    const [reschedulePickerMode, setReschedulePickerMode] = useState<'date' | 'time'>('date');

    // Rating State
    const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittedRating, setSubmittedRating] = useState(0);
    const [showFavoritePrompt, setShowFavoritePrompt] = useState(false);

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
    const canClientCancel = isClient && service.status && ['PENDING', 'ACCEPTED'].includes(service.status);
    const canClientReschedule = isClient && service.status && ['PENDING', 'ACCEPTED'].includes(service.status);
    const canWorkerCancel = isWorker && service.status === 'ACCEPTED';

    // Map Coordinates
    const destCoords = {
        latitude: service.latitude ? Number(service.latitude) : 6.2442,
        longitude: service.longitude ? Number(service.longitude) : -75.5812,
    };
    const showNativeMap = Platform.OS !== 'web' && __DEV__;

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

    const handleCancel = () => {
        const isWorkerAbandoning = isWorker && service?.status === 'ACCEPTED';
        Alert.alert(
            isWorkerAbandoning ? 'Abandonar servicio' : 'Cancelar servicio',
            isWorkerAbandoning
                ? '¿Seguro que quieres abandonar este servicio? El cliente será notificado.'
                : '¿Seguro que quieres cancelar este servicio?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: isWorkerAbandoning ? 'Sí, abandonar' : 'Sí, cancelar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await cancelService.mutateAsync(Number(id));
                            Alert.alert('Servicio cancelado', 'El servicio fue cancelado correctamente.');
                            router.back();
                        } catch (err: any) {
                            Alert.alert('Error', err?.response?.data?.error || 'No se pudo cancelar el servicio.');
                        }
                    }
                }
            ]
        );
    };

    const onReschedulePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || rescheduleDate;

        if (Platform.OS === 'android') {
            setShowReschedulePicker(false);
            if (event.type === 'set') {
                if (reschedulePickerMode === 'date') {
                    setRescheduleDate(currentDate);
                    setTimeout(() => {
                        setReschedulePickerMode('time');
                        setShowReschedulePicker(true);
                    }, 100);
                } else {
                    setRescheduleDate(currentDate);
                    setReschedulePickerMode('date');
                    confirmReschedule(currentDate);
                }
            } else {
                setReschedulePickerMode('date');
            }
        } else {
            setRescheduleDate(currentDate);
        }
    };

    const confirmReschedule = async (selectedDateTime: Date) => {
        try {
            await rescheduleService.mutateAsync({
                id: Number(id),
                scheduled_at: selectedDateTime.toISOString()
            });
            Alert.alert('¡Excelente!', 'El servicio ha sido reprogramado correctamente.');
        } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.error || 'No se pudo reprogramar el servicio.');
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
            setSubmittedRating(rating);
            setShowFavoritePrompt(true);
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
                <MapSection
                    colors={colors}
                    destCoords={destCoords}
                    address={service.address}
                    onOpenNavigation={handleOpenNavigation}
                    showNativeMap={showNativeMap}
                    styles={styles}
                />

                <StatusSection
                    colors={colors}
                    styles={styles}
                    status={service.status}
                />

                <WorkerActions
                    isWorker={isWorker}
                    serviceStatus={service.status}
                    canWorkerCancel={canWorkerCancel}
                    onStart={handleStart}
                    onComplete={handleComplete}
                    onCancel={handleCancel}
                    startLoading={startService.isPending}
                    completeLoading={completeService.isPending}
                    cancelLoading={cancelService.isPending}
                    colors={colors}
                    styles={styles}
                />

                <ClientActions
                    canClientCancel={canClientCancel}
                    canClientReschedule={canClientReschedule}
                    showReschedulePicker={showReschedulePicker}
                    rescheduleDate={rescheduleDate}
                    reschedulePickerMode={reschedulePickerMode}
                    onShowReschedulePicker={() => {
                        setReschedulePickerMode('date');
                        setShowReschedulePicker(true);
                    }}
                    onReschedulePickerChange={onReschedulePickerChange}
                    onConfirmReschedule={() => {
                        setShowReschedulePicker(false);
                        confirmReschedule(rescheduleDate);
                    }}
                    onCancel={handleCancel}
                    rescheduleLoading={rescheduleService.isPending}
                    cancelLoading={cancelService.isPending}
                    colors={colors}
                    styles={styles}
                />

                <RatingSection
                    isClient={isClient}
                    canRate={canRate}
                    serviceReview={service.review}
                    serviceWorker={service.worker}
                    serviceWorkerName={service.worker_name}
                    onShowRatingModal={() => setIsRatingModalVisible(true)}
                    showFavoritePrompt={showFavoritePrompt}
                    submittedRating={submittedRating}
                    onDismissFavoritePrompt={() => setShowFavoritePrompt(false)}
                    colors={colors}
                    styles={styles}
                />

                <InfoSection
                    service={service}
                    incidents={incidents}
                    onOpenIncidentModal={() => setIsIncidentModalVisible(true)}
                    colors={colors}
                    styles={styles}
                />

                <View style={styles.footerSpace} />
            </ScrollView>

            <IncidentModal
                visible={isIncidentModalVisible}
                incidentType={incidentType}
                incidentDescription={incidentDescription}
                onChangeType={setIncidentType}
                onChangeDescription={setIncidentDescription}
                onClose={() => setIsIncidentModalVisible(false)}
                onSubmit={handleReportIncident}
                isPending={reportIncident.isPending}
                colors={colors}
                styles={styles}
            />

            <RatingModal
                visible={isRatingModalVisible}
                rating={rating}
                comment={comment}
                serviceCategoryName={service.category_name}
                onClose={() => setIsRatingModalVisible(false)}
                onSetRating={setRating}
                onSetComment={setComment}
                onSubmit={handleRate}
                colors={colors}
                styles={styles}
            />
        </NativeMainLayout>
    );
}
