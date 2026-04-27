import React, { useMemo, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useEscalateIncident, useRefundFlag } from '../../hooks/useAdmin';
import { Incident, INCIDENT_TYPE_LABELS, INCIDENT_STATUS_LABELS } from '../../types/support';
import { getStyles } from './IncidentDetail.styles';

const STATUS_COLORS: Record<string, string> = {
    OPEN: '#ed8936',
    IN_REVIEW: '#667eea',
    ESCALATED: '#f56565',
    RESOLVED: '#48bb78',
    DISMISSED: '#a0aec0',
};

interface Props {
    incident: Incident | null;
    onClose: () => void;
}

export function IncidentDetail({ incident, onClose }: Props) {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [note, setNote] = useState('');
    const escalate = useEscalateIncident();
    const refund = useRefundFlag();

    if (!incident) return null;

    const statusColor = STATUS_COLORS[incident.status] ?? colors.textMuted;

    const handleEscalate = () => {
        if (!note.trim()) { Alert.alert('Error', 'Agrega una nota de escalamiento.'); return; }
        escalate.mutate({ id: incident.id, note }, {
            onSuccess: () => { setNote(''); onClose(); },
            onError: () => Alert.alert('Error', 'No se pudo escalar el incidente.'),
        });
    };

    const handleRefund = () => {
        Alert.alert('Confirmar', '¿Marcar como necesita reembolso?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Confirmar',
                onPress: () => refund.mutate(incident.id, {
                    onSuccess: onClose,
                    onError: () => Alert.alert('Error', 'No se pudo marcar el reembolso.'),
                }),
            },
        ]);
    };

    return (
        <Modal visible transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Detalle Incidente</Text>
                        <TouchableOpacity onPress={onClose}><X size={24} color={colors.textLight} /></TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
                            <Text style={[styles.badgeText, { color: statusColor }]}>{INCIDENT_STATUS_LABELS[incident.status]}</Text>
                        </View>

                        <Text style={styles.label}>Tipo</Text>
                        <Text style={styles.value}>{INCIDENT_TYPE_LABELS[incident.incident_type]}</Text>

                        <Text style={styles.label}>Servicio</Text>
                        <Text style={styles.value}>#{incident.service_request}</Text>

                        <Text style={styles.label}>Descripción</Text>
                        <Text style={styles.value}>{incident.description}</Text>

                        <Text style={styles.label}>Fecha</Text>
                        <Text style={styles.value}>{new Date(incident.created_at).toLocaleString()}</Text>

                        {incident.status !== 'ESCALATED' && incident.status !== 'RESOLVED' && incident.status !== 'DISMISSED' && (
                            <>
                                <Text style={styles.label}>Nota de escalamiento</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Motivo del escalamiento..."
                                    placeholderTextColor={colors.textMuted}
                                    multiline
                                    value={note}
                                    onChangeText={setNote}
                                />

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={[styles.btn, { backgroundColor: colors.danger + '15', borderWidth: 1, borderColor: colors.danger }]}
                                        onPress={handleRefund}
                                        disabled={refund.isPending || incident.needs_refund}
                                    >
                                        <Text style={[styles.btnText, { color: colors.danger }]}>
                                            {incident.needs_refund ? 'Reembolso marcado' : 'Marcar Reembolso'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.btn, { backgroundColor: colors.warning }]}
                                        onPress={handleEscalate}
                                        disabled={escalate.isPending}
                                    >
                                        <Text style={[styles.btnText, { color: '#fff' }]}>Escalar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
