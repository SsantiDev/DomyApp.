import React, { useState, useMemo } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/NativeButton';
import { Card } from '../ui/NativeCard';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { X, ChevronRight, Calendar, MapPin, ClipboardList, CheckCircle2, Sparkles, Zap, Home, Wrench, Utensils, Clock, WashingMachine, Leaf, PawPrint } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useCategories, useCreateServiceRequest } from '../../hooks/useServices';
import { Category } from '../../types/services';

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

        try {
            await createRequest.mutateAsync({
                category: selectedCategory.id,
                scheduled_at: date.toISOString(),
                address: address || 'Dirección de prueba',
                details: details
            });
            setStep('SUCCESS');
        } catch (error) {
            console.error(error);
        }
    };

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        content: {
            backgroundColor: colors.surface,
            borderTopLeftRadius: RADIUS.xl,
            borderTopRightRadius: RADIUS.xl,
            maxHeight: '90%',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: SPACING.xl,
            borderBottomWidth: 1,
            borderBottomColor: colors.border + '10',
        },
        footer: {
            padding: SPACING.xl,
            paddingBottom: insets.bottom > 0 ? insets.bottom + SPACING.md : SPACING.xl,
            borderTopWidth: 1,
            borderTopColor: colors.border + '10',
            backgroundColor: colors.surface,
        },
        body: {
            padding: SPACING.xl,
        },
        title: {
            fontSize: TYPOGRAPHY.h2.fontSize,
            fontWeight: TYPOGRAPHY.h2.fontWeight,
            color: colors.text,
        },
        subtitle: {
            fontSize: 14,
            color: colors.textLight,
            marginBottom: SPACING.lg,
        },
        categoryContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: SPACING.md,
            marginBottom: SPACING.xl,
        },
        categoryItem: {
            width: '47%',
            padding: SPACING.lg,
            borderRadius: RADIUS.lg,
            borderWidth: 2,
            alignItems: 'center',
            gap: SPACING.sm,
        },
        inputContainer: {
            marginBottom: SPACING.lg,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
            marginBottom: SPACING.xs,
        },
        input: {
            backgroundColor: colors.background,
            borderRadius: RADIUS.md,
            padding: SPACING.md,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.border,
            fontSize: 15,
        },
        dateButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: RADIUS.md,
            padding: SPACING.md,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 12,
        },
        dateButtonText: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600',
            textTransform: 'capitalize',
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: SPACING.sm,
            marginTop: SPACING.xs,
        },
        sectionHeaderText: {
            fontSize: 14,
            fontWeight: '700',
            color: colors.primary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        summaryCard: {
            padding: SPACING.lg,
            gap: SPACING.md,
            marginBottom: SPACING.xl,
        },
        summaryRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.sm,
        },
        successContainer: {
            alignItems: 'center',
            paddingVertical: SPACING.xxl,
            gap: SPACING.md,
        },
        priceTag: {
            fontSize: 28,
            fontWeight: '900',
            color: colors.primary,
        },
        divider: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: SPACING.lg,
            borderStyle: 'dashed',
            borderRadius: 1,
        },
        summaryItem: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: SPACING.md,
        },
        summaryLabel: {
            fontSize: 12,
            color: colors.textLight,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 2,
        },
        summaryValue: {
            fontSize: 15,
            color: colors.text,
            fontWeight: '600',
        },
        paymentNote: {
            backgroundColor: colors.primary + '08',
            padding: SPACING.md,
            borderRadius: RADIUS.md,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: SPACING.sm,
        }
    });

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
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Calle 123 #45-67, Apto 501"
                                placeholderTextColor={colors.textLight + '80'}
                                value={address}
                                onChangeText={setAddress}
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
