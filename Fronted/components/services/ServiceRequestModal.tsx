import React, { useState, useMemo } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
    Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/NativeButton';
import { Card } from '../ui/NativeCard';
import { SPACING, RADIUS } from '../../constants/theme';
import { getStyles } from './ServiceRequestModal.styles';
import { X, ChevronRight, Calendar, MapPin, ClipboardList, CheckCircle2, Sparkles, Zap, Home, Wrench, Utensils, Clock, WashingMachine, Leaf, PawPrint } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useCategories, useCreateServiceRequest } from '../../hooks/useServices';
import { Category } from '../../types/services';
import { LocationPickerMap } from './LocationPickerMap';

interface Props {
    visible: boolean;
    onClose: () => void;
}

type Step = 'CATEGORY' | 'DETAILS' | 'CONFIRM' | 'SUCCESS';

const CategoryIcon = ({ name, color, size = 26 }: { name: string; color: string; size?: number }) => {
    switch (name) {
        case 'sparkles':
        case 'broom': return <Sparkles color={color} size={size} />;
        case 'zap': return <Zap color={color} size={size} />;
        case 'home': return <Home color={color} size={size} />;
        case 'wrench': return <Wrench color={color} size={size} />;
        case 'utensils': return <Utensils color={color} size={size} />;
        case 'washing-machine': return <WashingMachine color={color} size={size} />;
        case 'leaf': return <Leaf color={color} size={size} />;
        case 'paw-print': return <PawPrint color={color} size={size} />;
        default: return <Sparkles color={color} size={size} />;
    }
};

export const ServiceRequestModal = ({ visible, onClose }: Props) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { data: categories, isLoading: loadingCats } = useCategories();
    const createRequest = useCreateServiceRequest();

    const [step, setStep] = useState<Step>('CATEGORY');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [details, setDetails] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const formatDate = (val: Date) => {
        return val.toLocaleString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const onPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;

        if (Platform.OS === 'android') {
            setShowPicker(false);
            if (event.type === 'set') {
                if (pickerMode === 'date') {
                    setDate(currentDate);
                    // After picking date, show time picker
                    setTimeout(() => {
                        setPickerMode('time');
                        setShowPicker(true);
                    }, 100);
                } else {
                    setDate(currentDate);
                    setPickerMode('date');
                }
            } else {
                setPickerMode('date');
            }
        } else {
            setDate(currentDate);
        }
    };

    const reset = () => {
        setStep('CATEGORY');
        setSelectedCategory(null);
        setDate(new Date());
        setDetails('');
        setAddress('');
        setLatitude(null);
        setLongitude(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleNext = () => {
        if (step === 'CATEGORY' && selectedCategory) setStep('DETAILS');
        else if (step === 'DETAILS') setStep('CONFIRM');
    };

    const handleConfirm = async () => {
        if (!selectedCategory) return;

        if (address.trim() === '') {
            Alert.alert('Error', 'Por favor ingresa una dirección válida');
            return;
        }

        try {
            await createRequest.mutateAsync({
                category: selectedCategory.id,
                scheduled_at: date.toISOString(),
                address: address,
                details: details,
                ...(latitude !== null && longitude !== null
                    ? {
                        latitude: parseFloat(latitude.toFixed(6)),
                        longitude: parseFloat(longitude.toFixed(6)),
                    }
                    : {}),
            });
            setStep('SUCCESS');
        } catch (error) {
            console.error(error);
        }
    };

    const styles = useMemo(() => getStyles(colors, insets.bottom), [colors, insets.bottom]);

    const renderStep = () => {
        switch (step) {
            case 'CATEGORY':
                return (
                    <View>
                        <Text style={styles.subtitle}>Selecciona el tipo de servicio que necesitas</Text>
                        <View style={styles.categoryContainer}>
                            {categories?.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => setSelectedCategory(cat)}
                                    style={[
                                        styles.categoryItem,
                                        {
                                            borderColor: selectedCategory?.id === cat.id ? colors.primary : colors.border,
                                            backgroundColor: selectedCategory?.id === cat.id ? colors.primary + '10' : colors.surface
                                        }
                                    ]}
                                >
                                    <View style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        backgroundColor: selectedCategory?.id === cat.id ? colors.primary : colors.background,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 4
                                    }}>
                                        <CategoryIcon
                                            name={cat.icon_name}
                                            color={selectedCategory?.id === cat.id ? colors.white : colors.primary}
                                        />
                                    </View>
                                    <Text style={{ fontWeight: '700', color: colors.text, fontSize: 15 }}>{cat.name}</Text>
                                    <Text style={{ fontSize: 12, color: colors.textLight }}>Desde ${Number(cat.base_price).toLocaleString()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );

            case 'DETAILS':
                return (
                    <View>
                        <View style={styles.inputContainer}>
                            <View style={styles.sectionHeader}>
                                <Calendar size={16} color={colors.primary} />
                                <Text style={styles.sectionHeaderText}>Fecha y Hora</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => {
                                    setPickerMode('date');
                                    setShowPicker(true);
                                }}
                                activeOpacity={0.7}
                            >
                                <Clock size={20} color={colors.textLight} />
                                <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
                            </TouchableOpacity>

                            {showPicker && (
                                <DateTimePicker
                                    value={date}
                                    mode={pickerMode}
                                    is24Hour={false}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onPickerChange}
                                    minimumDate={new Date()}
                                />
                            )}
                            {Platform.OS === 'ios' && showPicker && (
                                <Button
                                    title="Confirmar Fecha"
                                    variant="outline"
                                    style={{ marginTop: 8 }}
                                    onPress={() => setShowPicker(false)}
                                />
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.sectionHeader}>
                                <MapPin size={16} color={colors.primary} />
                                <Text style={styles.sectionHeaderText}>Dirección</Text>
                            </View>
                            <LocationPickerMap
                                initialAddress={address}
                                initialLat={latitude ?? undefined}
                                initialLng={longitude ?? undefined}
                                onLocationSelected={(lat, lng, addr) => {
                                    setLatitude(lat);
                                    setLongitude(lng);
                                    setAddress(addr);
                                }}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.sectionHeader}>
                                <ClipboardList size={16} color={colors.primary} />
                                <Text style={styles.sectionHeaderText}>Instrucciones</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                placeholder="Instrucciones adicionales para la operaria..."
                                placeholderTextColor={colors.textLight + '80'}
                                multiline
                                value={details}
                                onChangeText={setDetails}
                            />
                        </View>
                    </View>
                );

            case 'CONFIRM':
                return (
                    <View>
                        <Text style={[styles.subtitle, { marginBottom: SPACING.md }]}>
                            Verifica los detalles de tu solicitud antes de confirmar.
                        </Text>

                        <Card style={{ padding: SPACING.xl, borderRadius: RADIUS.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: colors.border }}>
                            <View style={styles.summaryItem}>
                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '10', alignItems: 'center', justifyContent: 'center' }}>
                                    <CategoryIcon name={selectedCategory?.icon_name || ''} color={colors.primary} size={20} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.summaryLabel}>Servicio</Text>
                                    <Text style={styles.summaryValue}>{selectedCategory?.name}</Text>
                                </View>
                            </View>

                            <View style={styles.summaryItem}>
                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}>
                                    <Calendar size={18} color={colors.textLight} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.summaryLabel}>Programado para</Text>
                                    <Text style={[styles.summaryValue, { textTransform: 'capitalize' }]}>
                                        {formatDate(date)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.summaryItem}>
                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}>
                                    <MapPin size={18} color={colors.textLight} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.summaryLabel}>Ubicación</Text>
                                    <Text style={styles.summaryValue}>{address || 'Tu dirección guardada'}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.summaryLabel, { marginBottom: 2 }]}>Total Estimado</Text>
                                <Text
                                    style={styles.priceTag}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                >
                                    ${Number(selectedCategory?.base_price).toLocaleString()}
                                </Text>
                                <Text style={{ fontSize: 11, color: colors.textLight, marginTop: 2 }}>
                                    Sujeto a cambios menores
                                </Text>
                            </View>

                            <View style={styles.paymentNote}>
                                <CheckCircle2 size={16} color={colors.success} />
                                <Text style={{ fontSize: 13, color: colors.textLight, fontWeight: '500' }}>
                                    Pago seguro al finalizar la labor
                                </Text>
                            </View>
                        </Card>
                    </View>
                );

            case 'SUCCESS':
                return (
                    <View style={styles.successContainer}>
                        <CheckCircle2 size={80} color={colors.primary} />
                        <Text style={styles.title}>¡Solicitud Enviada!</Text>
                        <Text style={[styles.subtitle, { textAlign: 'center' }]}>
                            Estamos buscando la mejor operaria para tu servicio. Te notificaremos pronto.
                        </Text>
                        <Button title="Entendido" onPress={handleClose} style={{ width: '100%' }} />
                    </View>
                );
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {step === 'CATEGORY' ? 'Nuevo Servicio' :
                                step === 'DETAILS' ? 'Detalles' :
                                    step === 'CONFIRM' ? 'Confirmación' : ''}
                        </Text>
                        {step !== 'SUCCESS' && (
                            <TouchableOpacity onPress={handleClose}>
                                <X color={colors.text} size={24} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.body}
                        contentContainerStyle={{ paddingBottom: SPACING.xxl }}
                    >
                        {renderStep()}
                    </ScrollView>

                    {step !== 'SUCCESS' && (
                        <View style={styles.footer}>
                            <Button
                                title={
                                    step === 'CATEGORY' ? 'Continuar' :
                                        step === 'DETAILS' ? 'Revisar Solicitud' :
                                            'Confirmar Solicitud'
                                }
                                disabled={step === 'CATEGORY' && !selectedCategory}
                                onPress={step === 'CONFIRM' ? handleConfirm : handleNext}
                                loading={step === 'CONFIRM' && createRequest.isPending}
                            />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
