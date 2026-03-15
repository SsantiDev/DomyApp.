import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { UserMenu } from '../ui/UserMenu';
import { Button } from '../ui/NativeButton';
import { Card } from '../ui/NativeCard';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { ServiceRequestModal } from '../services/ServiceRequestModal';
import { useServiceRequests } from '../../hooks/useServices';
import { useRouter } from 'expo-router';
import { Sparkles, History, ShieldCheck, Clock, CheckCircle, User, ChevronRight } from 'lucide-react-native';

export default function ClientDashboard() {
    const { colors } = useTheme();
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { data: requests, isLoading } = useServiceRequests();

    const activeRequest = useMemo(() =>
        requests?.find(r => r.status === 'PENDING' || r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS'),
        [requests]);

    const completedRequests = useMemo(() =>
        requests?.filter(r => r.status === 'COMPLETED').slice(0, 3) || [],
        [requests]);

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <UserMenu />
                <View style={styles.greetingHeader}>
                    <Text style={[styles.greeting, { color: colors.text }]}>¡Hola!</Text>
                    <Text style={[styles.subtitle, { color: colors.textLight }]}>La ayuda que necesitas, a un clic.</Text>
                </View>
            </View>

            {isLoading ? (
                <ActivityIndicator color={colors.primary} style={{ marginBottom: SPACING.xl }} />
            ) : activeRequest ? (
                <Card style={[styles.statusCard, { borderColor: colors.primary + '30' }]}>
                    <View style={styles.statusHeader}>
                        <View style={styles.statusInfo}>
                            <Clock size={16} color={colors.primary} />
                            <Text style={[styles.statusTitle, { color: colors.text }]}>
                                {activeRequest.status === 'PENDING' ? 'Buscando Operaria' :
                                    activeRequest.status === 'ACCEPTED' ? 'Servicio Confirmado' : 'Labor en Proceso'}
                            </Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: activeRequest.status === 'PENDING' ? colors.warning + '20' : colors.success + '20' }]}>
                            <Text style={[styles.badgeText, { color: activeRequest.status === 'PENDING' ? colors.warning : colors.success }]}>
                                {activeRequest.status === 'PENDING' ? 'Pendiente' :
                                    activeRequest.status === 'ACCEPTED' ? 'Asignado' : 'En Labor'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statusContent}>
                        <Text style={[styles.categoryName, { color: colors.text }]}>{activeRequest.category_name}</Text>
                        <Text style={[styles.addressText, { color: colors.textLight }]}>{activeRequest.address}</Text>

                        {activeRequest.worker && (
                            <View style={styles.workerInfo}>
                                <View style={[styles.avatarMini, { backgroundColor: colors.primary }]}>
                                    <User size={14} color="#FFF" />
                                </View>
                                <Text style={[styles.workerText, { color: colors.text }]}>
                                    {activeRequest.status === 'IN_PROGRESS' ? 'Tu operaria está trabajando' : 'Tu operaria está en camino'}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.detailLink, { marginTop: SPACING.md }]}
                            onPress={() => router.push(`/service-detail/${activeRequest.id}`)}
                        >
                            <Text style={[styles.detailLinkText, { color: colors.primary }]}>Ver detalles y mapa</Text>
                            <ChevronRight size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </Card>
            ) : (
                <View style={styles.promoCard}>
                    <View style={styles.promoContent}>
                        <Sparkles color="#FFF" size={24} />
                        <Text style={styles.promoText}>Profesionaliza tu hogar con operarias verificadas por Domy.</Text>
                    </View>
                </View>
            )}

            <View style={styles.actionSection}>
                <Button
                    title={activeRequest ? "Solicitar otro servicio" : "Solicitar servicio"}
                    onPress={() => setIsModalVisible(true)}
                />
            </View>

            {completedRequests.length > 0 && (
                <View style={styles.recentSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Servicios Recientes</Text>
                    {completedRequests.map((req) => (
                        <TouchableOpacity
                            key={req.id}
                            style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => router.push(`/service-detail/${req.id}`)}
                        >
                            <View style={styles.historyIcon}>
                                <CheckCircle size={20} color={colors.success} />
                            </View>
                            <View style={styles.historyInfo}>
                                <Text style={[styles.historyCategory, { color: colors.text }]}>{req.category_name}</Text>
                                <Text style={[styles.historyDate, { color: colors.textLight }]}>
                                    {new Date(req.scheduled_at).toLocaleDateString()}
                                </Text>
                            </View>
                            {!req.review && (
                                <View style={[styles.rateTag, { backgroundColor: colors.warning + '15' }]}>
                                    <Text style={[styles.rateTagText, { color: colors.warning }]}>Calificar</Text>
                                </View>
                            )}
                            <ChevronRight size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <View style={styles.infoGrid}>
                <Card style={styles.infoCard}>
                    <ShieldCheck color={colors.primary} size={24} />
                    <Text style={[styles.infoTitle, { color: colors.text }]}>Seguridad</Text>
                    <Text style={[styles.infoDesc, { color: colors.textLight }]}>Operarias 100% verificadas.</Text>
                </Card>
                <Card style={styles.infoCard}>
                    <History color={colors.primary} size={24} />
                    <Text style={[styles.infoTitle, { color: colors.text }]}>Trazabilidad</Text>
                    <Text style={[styles.infoDesc, { color: colors.textLight }]}>Historial y pagos claros.</Text>
                </Card>
            </View>

            <ServiceRequestModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    greetingHeader: {
        marginTop: SPACING.lg,
    },
    greeting: {
        fontSize: TYPOGRAPHY.h1.fontSize,
        fontWeight: TYPOGRAPHY.h1.fontWeight,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.body.fontSize,
        marginTop: SPACING.xs
    },
    statusCard: {
        marginBottom: SPACING.xl,
        padding: SPACING.lg,
        borderWidth: 1,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    statusInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: RADIUS.full,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    statusContent: {
        gap: 4,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: '800',
    },
    addressText: {
        fontSize: 13,
    },
    workerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    avatarMini: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    workerText: {
        fontSize: 13,
        fontWeight: '600',
    },
    promoCard: {
        backgroundColor: '#7B61FF',
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
    },
    promoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    promoText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    actionSection: {
        marginBottom: SPACING.xl,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    infoCard: {
        flex: 1,
        gap: SPACING.sm,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    infoDesc: {
        fontSize: 12,
    },
    detailLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailLinkText: {
        fontSize: 14,
        fontWeight: '700',
    },
    recentSection: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: SPACING.md,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        marginBottom: 10,
    },
    historyIcon: {
        marginRight: 12,
    },
    historyInfo: {
        flex: 1,
    },
    historyCategory: {
        fontSize: 15,
        fontWeight: '700',
    },
    historyDate: {
        fontSize: 12,
        marginTop: 2,
    },
    rateTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
        marginRight: 8,
    },
    rateTagText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    }
});
