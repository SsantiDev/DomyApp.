import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, Clock, Calendar, User, Briefcase, ShieldAlert } from 'lucide-react-native';
import { Card } from '../ui/NativeCard';
import { INCIDENT_TYPE_LABELS } from '../../types/support';

interface InfoSectionProps {
    service: any;
    incidents: any[] | undefined;
    onOpenIncidentModal: () => void;
    colors: any;
    styles: any;
}

export const InfoSection = ({ service, incidents, onOpenIncidentModal, colors, styles }: InfoSectionProps) => (
    <View style={styles.infoSection}>
        <Card variant="flat" style={styles.infoCard}>
            <View style={styles.sectionHeader}>
                <Briefcase size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Servicio</Text>
            </View>
            <Text style={[styles.categoryTitle, { color: colors.text }]}>{service.category_name}</Text>
            <View style={styles.row}>
                <Clock size={16} color={colors.textLight} />
                <Text style={[styles.detailText, { color: colors.textLight }]}
                >
                    {new Date(service.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
            <View style={styles.row}>
                <Calendar size={16} color={colors.textLight} />
                <Text style={[styles.detailText, { color: colors.textLight }]}
                >
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
                    <Text style={[styles.detailsLabel, { color: colors.textLight }]}
                    >
                        Instrucciones:
                    </Text>
                    <Text style={[styles.detailsText, { color: colors.text }]}>{service.details}</Text>
                </View>
            )}
        </Card>

        {incidents && incidents.length > 0 && (
            <Card variant="flat" style={[styles.infoCard, { borderTopWidth: 2, borderTopColor: colors.danger + '40' }]}
            >
                <View style={styles.sectionHeader}>
                    <ShieldAlert size={20} color={colors.danger} />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Reporte de Incidencias</Text>
                </View>
                {incidents.map((inc) => (
                    <View key={inc.id} style={styles.incidentItem}>
                        <View style={styles.incidentHeader}>
                            <Text style={[styles.incidentType, { color: colors.text }]}
                            >
                                {INCIDENT_TYPE_LABELS[inc.incident_type]}
                            </Text>
                            <View style={[styles.miniBadge, { backgroundColor: colors.warning + '15' }]}
                            >
                                <Text style={[styles.miniBadgeText, { color: colors.warning }]}
                                >
                                    {inc.status === 'OPEN' ? 'En espera' : 'Revisado'}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.incidentText, { color: colors.textLight }]}
                        >
                            {inc.description}
                        </Text>
                    </View>
                ))}
            </Card>
        )}

        <TouchableOpacity
            style={styles.inlineButton}
            onPress={onOpenIncidentModal}
        >
            <ShieldAlert size={16} color={colors.textMuted} />
            <Text style={[styles.inlineButtonText, { color: colors.textMuted }]}>
                Reportar un problema
            </Text>
        </TouchableOpacity>
    </View>
);
