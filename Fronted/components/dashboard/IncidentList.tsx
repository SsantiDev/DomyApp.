import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { AlertTriangle, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAdminIncidents } from '../../hooks/useAdmin';
import { Incident, INCIDENT_TYPE_LABELS, INCIDENT_STATUS_LABELS } from '../../types/support';
import { getStyles } from './IncidentList.styles';

const STATUS_COLORS: Record<string, string> = {
    OPEN: '#ed8936',
    IN_REVIEW: '#667eea',
    ESCALATED: '#f56565',
    RESOLVED: '#48bb78',
    DISMISSED: '#a0aec0',
};

interface Props {
    onSelect: (incident: Incident) => void;
}

export function IncidentList({ onSelect }: Props) {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { data: incidents, isLoading } = useAdminIncidents();

    if (isLoading) {
        return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />;
    }

    const active = incidents?.filter(i => i.status !== 'RESOLVED' && i.status !== 'DISMISSED') ?? [];

    if (active.length === 0) {
        return (
            <View style={styles.empty}>
                <AlertTriangle size={48} color={colors.textMuted} strokeWidth={1} />
                <Text style={styles.emptyText}>Sin incidentes activos</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            {active.map(incident => {
                const statusColor = STATUS_COLORS[incident.status] ?? colors.textMuted;
                return (
                    <TouchableOpacity key={incident.id} style={styles.row} onPress={() => onSelect(incident)}>
                        <View style={styles.info}>
                            <Text style={styles.type}>{INCIDENT_TYPE_LABELS[incident.incident_type]}</Text>
                            <Text style={styles.meta}>Servicio #{incident.service_request} · {new Date(incident.created_at).toLocaleDateString()}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
                            <Text style={[styles.badgeText, { color: statusColor }]}>
                                {INCIDENT_STATUS_LABELS[incident.status]}
                            </Text>
                        </View>
                        <ChevronRight size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}
