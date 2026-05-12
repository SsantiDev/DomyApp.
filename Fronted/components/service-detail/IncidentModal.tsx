import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Card } from '../ui/NativeCard';
import { IncidentType, INCIDENT_TYPE_LABELS } from '../../types/support';
import { SPACING } from '../../constants/theme';

interface IncidentModalProps {
    visible: boolean;
    incidentType: IncidentType;
    incidentDescription: string;
    onChangeType: (type: IncidentType) => void;
    onChangeDescription: (value: string) => void;
    onClose: () => void;
    onSubmit: () => void;
    isPending: boolean;
    colors: any;
    styles: any;
}

export const IncidentModal = ({
    visible,
    incidentType,
    incidentDescription,
    onChangeType,
    onChangeDescription,
    onClose,
    onSubmit,
    isPending,
    colors,
    styles,
}: IncidentModalProps) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <Card style={[styles.ratingModal, { backgroundColor: colors.background }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Reportar incidencia</Text>
                <Text style={[styles.modalSubtitle, { color: colors.textLight }]}
                >
                    Cuéntanos qué sucedió para que Domy pueda asistirte.
                </Text>

                <Text style={[styles.label, { color: colors.text, marginBottom: 8 }]}
                >
                    Tipo de problema
                </Text>
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
                            onPress={() => onChangeType(type)}
                        >
                            <Text style={[
                                styles.typeOptionText,
                                { color: incidentType === type ? colors.primary : colors.textLight }
                            ]}
                            >
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
                    onChangeText={onChangeDescription}
                />

                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        style={[styles.modalBtn, { backgroundColor: colors.surface }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.modalBtnText, { color: colors.textLight }]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modalBtn, { backgroundColor: colors.danger }]}
                        onPress={onSubmit}
                        disabled={isPending}
                    >
                        <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Enviar Reporte</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        </View>
    </Modal>
);
