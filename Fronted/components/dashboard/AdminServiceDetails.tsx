import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useVerifyBilling } from '../../hooks/useAdmin';
import { ServiceRequest } from '../../types/services';
import { User, MapPin, Calendar, CheckCircle, AlertTriangle, DollarSign, X } from 'lucide-react-native';
import { INCIDENT_TYPE_LABELS, INCIDENT_STATUS_LABELS } from '../../types/support';
import { ChatRoom } from '../chat/ChatRoom';

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pendiente',
    ACCEPTED: 'Asignado',
    IN_PROGRESS: 'En Proceso',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
};

export const AdminServiceDetails = ({ 
    service, 
    visible, 
    onClose 
}: { 
    service: ServiceRequest | null, 
    visible: boolean, 
    onClose: () => void 
}) => {
    const { colors } = useTheme();
    const { mutate: verifyBilling, isPending: isVerifying } = useVerifyBilling();
    const [showChat, setShowChat] = useState(false);

    if (!service) return null;

    const handleBilling = () => {
        if (!service.id) return;
        verifyBilling(service.id, {
            onSuccess: () => {
                // Could show a toast here, but query invalidation handles the UI update
                onClose();
            }
        });
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.title, { color: colors.text }]}>Detalle del Servicio #{service.id}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    {/* Status & Billing Headers */}
                    <View style={styles.tagsRow}>
                        <View style={[styles.tag, { backgroundColor: colors.primary }]}>
                            <Text style={styles.tagText}>{STATUS_LABELS[service.status || 'PENDING']}</Text>
                        </View>
                        {service.is_billed && (
                            <View style={[styles.tag, { backgroundColor: colors.success }]}>
                                <CheckCircle size={14} color="#fff" />
                                <Text style={[styles.tagText, { marginLeft: 4 }]}>Facturado</Text>
                            </View>
                        )}
                    </View>

                    {/* People info */}
                    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Involucrados</Text>
                        <View style={styles.row}>
                            <User size={20} color={colors.textMuted} />
                            <View style={styles.rowText}>
                                <Text style={[styles.label, { color: colors.textMuted }]}>Cliente</Text>
                                <Text style={[styles.value, { color: colors.text }]}>{service.client_name || service.client_email}</Text>
                            </View>
                        </View>
                        <View style={[styles.row, { marginTop: 12 }]}>
                            <User size={20} color={colors.primary} />
                            <View style={styles.rowText}>
                                <Text style={[styles.label, { color: colors.textMuted }]}>Operaria</Text>
                                <Text style={[styles.value, { color: colors.text }]}>{service.worker_name || service.worker_email || 'No asignada'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Service Info */}
                    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Datos del Servicio</Text>
                        <View style={styles.row}>
                            <Calendar size={20} color={colors.textMuted} />
                            <View style={styles.rowText}>
                                <Text style={[styles.label, { color: colors.textMuted }]}>Fecha Programada</Text>
                                <Text style={[styles.value, { color: colors.text }]}>{new Date(service.scheduled_at).toLocaleString()}</Text>
                            </View>
                        </View>
                        <View style={[styles.row, { marginTop: 12 }]}>
                            <MapPin size={20} color={colors.textMuted} />
                            <View style={styles.rowText}>
                                <Text style={[styles.label, { color: colors.textMuted }]}>Dirección</Text>
                                <Text style={[styles.value, { color: colors.text }]}>{service.address}</Text>
                            </View>
                        </View>
                        <View style={[styles.row, { marginTop: 12 }]}>
                            <DollarSign size={20} color={colors.textMuted} />
                            <View style={styles.rowText}>
                                <Text style={[styles.label, { color: colors.textMuted }]}>Precio Base</Text>
                                <Text style={[styles.value, { color: colors.text, fontWeight: 'bold' }]}>${service.total_price}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Incidents (if any) */}
                    {service.incidents && service.incidents.length > 0 && (
                        <View style={[styles.section, { backgroundColor: colors.danger + '10', borderColor: colors.danger + '50', borderWidth: 1 }]}>
                            <Text style={[styles.sectionTitle, { color: colors.danger }]}>
                                <AlertTriangle size={18} color={colors.danger} /> Historial de Incidencias
                            </Text>
                            {service.incidents.map((inc) => (
                                <TouchableOpacity 
                                    key={inc.id} 
                                    style={{ marginTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.danger + '20' }}
                                    onPress={() => setShowChat(true)}
                                    activeOpacity={0.7}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', color: colors.danger, fontSize: 15 }}>
                                            {INCIDENT_TYPE_LABELS[inc.incident_type as keyof typeof INCIDENT_TYPE_LABELS] || inc.incident_type}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            {inc.status === 'OPEN' && (
                                                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: 'bold' }}>Responder 💬</Text>
                                            )}
                                            <View style={{ backgroundColor: colors.danger + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                                                <Text style={{ color: colors.danger, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                    {INCIDENT_STATUS_LABELS[inc.status as keyof typeof INCIDENT_STATUS_LABELS] || inc.status}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={{ color: colors.text, marginTop: 8, fontWeight: '600' }}>Reportado por: {inc.reporter_name}</Text>
                                    <Text style={{ color: colors.text, marginTop: 4, lineHeight: 20 }}>{inc.description}</Text>
                                    <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>{new Date(inc.created_at).toLocaleString()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                </ScrollView>

                {/* Billing Action (Only if completed and not billed) */}
                <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
                    <TouchableOpacity 
                        style={[styles.billingBtn, { backgroundColor: colors.primary, marginBottom: 12 }]}
                        onPress={() => setShowChat(true)}
                    >
                        <Text style={styles.billingBtnText}>📝 Abrir Chat del Servicio</Text>
                    </TouchableOpacity>

                    {service.status === 'COMPLETED' && !service.is_billed ? (
                        <TouchableOpacity 
                            style={[styles.billingBtn, { backgroundColor: colors.success }]}
                            onPress={handleBilling}
                            disabled={isVerifying}
                        >
                            {isVerifying ? <ActivityIndicator color="#fff" /> : <Text style={styles.billingBtnText}>Confirmar Cierre y Facturación</Text>}
                        </TouchableOpacity>
                    ) : service.is_billed ? (
                        <View style={[styles.billingBtn, { backgroundColor: colors.success, opacity: 0.7 }]}>
                            <Text style={styles.billingBtnText}>Servicio Facturado ✓</Text>
                        </View>
                    ) : (
                        <Text style={{ textAlign: 'center', color: colors.textMuted }}>Solo los servicios 'Completados' pueden ser facturados.</Text>
                    )}
                </View>
            </View>

            {showChat && (
                <ChatRoom 
                    serviceId={service.id!} 
                    visible={showChat} 
                    onClose={() => setShowChat(false)} 
                    defaultTab="SUPPORT" 
                />
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, borderBottomWidth: 1 },
    title: { fontSize: 20, fontWeight: 'bold' },
    closeButton: { padding: 5 },
    content: { flex: 1, padding: 20 },
    tagsRow: { flexDirection: 'row', marginBottom: 20 },
    tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginRight: 10 },
    tagText: { color: '#fff', fontWeight: '600', fontSize: 12 },
    section: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowText: { marginLeft: 12, flex: 1 },
    label: { fontSize: 12 },
    value: { fontSize: 15, marginTop: 2 },
    footer: { padding: 20, borderTopWidth: 1 },
    billingBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },
    billingBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
