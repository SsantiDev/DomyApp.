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
import { X, ChevronRight, Calendar, MapPin, ClipboardList, CheckCircle2 } from 'lucide-react-native';
import { useCategories, useCreateServiceRequest } from '../../hooks/useServices';
import { Category } from '../../types/services';

interface Props {
    visible: boolean;
    onClose: () => void;
}

type Step = 'CATEGORY' | 'DETAILS' | 'CONFIRM' | 'SUCCESS';

export const ServiceRequestModal = ({ visible, onClose }: Props) => {
    const { colors } = useTheme();
    const { data: categories, isLoading: loadingCats } = useCategories();
    const createRequest = useCreateServiceRequest();

    const [step, setStep] = useState<Step>('CATEGORY');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [date, setDate] = useState('');
    const [details, setDetails] = useState('');
    const [address, setAddress] = useState('');

    const reset = () => {
        setStep('CATEGORY');
        setSelectedCategory(null);
        setDate('');
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
                scheduled_at: new Date().toISOString(), // In real app, use 'date' input
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
            padding: SPACING.xl,
            maxHeight: '90%',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: SPACING.xl,
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
            fontSize: 24,
            fontWeight: '800',
            color: colors.primary,
            marginTop: SPACING.md,
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
                                    <Text style={{ fontSize: 24 }}>{cat.icon_name === 'broom' ? '🧹' : cat.icon_name === 'zap' ? '⚡' : '🛠️'}</Text>
                                    <Text style={{ fontWeight: '600', color: colors.text }}>{cat.name}</Text>
                                    <Text style={{ fontSize: 12, color: colors.textLight }}>Desde ${Number(cat.base_price).toLocaleString()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Button
                            title="Continuar"
                            disabled={!selectedCategory}
                            onPress={handleNext}
                        />
                    </View>
                );

            case 'DETAILS':
                return (
                    <View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Fecha y Hora aproximada</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Mañana a las 8:00 AM"
                                placeholderTextColor={colors.textLight + '80'}
                                value={date}
                                onChangeText={setDate}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Dirección del servicio</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar dirección"
                                placeholderTextColor={colors.textLight + '80'}
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Instrucciones adicionales</Text>
                            <TextInput
                                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                placeholder="Cuéntanos más detalles..."
                                placeholderTextColor={colors.textLight + '80'}
                                multiline
                                value={details}
                                onChangeText={setDetails}
                            />
                        </View>
                        <Button title="Revisar Solicitud" onPress={handleNext} />
                    </View>
                );

            case 'CONFIRM':
                return (
                    <View>
                        <Card style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <CheckCircle2 size={20} color={colors.primary} />
                                <Text style={{ color: colors.text }}>{selectedCategory?.name}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Calendar size={20} color={colors.textLight} />
                                <Text style={{ color: colors.text }}>{date || 'Por definir'}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <MapPin size={20} color={colors.textLight} />
                                <Text style={{ color: colors.text }}>{address || 'Dirección actual'}</Text>
                            </View>
                        </Card>
                        <View style={{ alignItems: 'center', marginBottom: SPACING.xl }}>
                            <Text style={{ color: colors.textLight }}>Total Estimado</Text>
                            <Text style={styles.priceTag}>${Number(selectedCategory?.base_price).toLocaleString()}</Text>
                        </View>
                        <Button
                            title="Confirmar Solicitud"
                            onPress={handleConfirm}
                            loading={createRequest.isPending}
                        />
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {renderStep()}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
