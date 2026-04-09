import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './AdminDashboard.styles';
import { useAdminServices } from '../../hooks/useAdmin';
import { AdminServiceDetails } from './AdminServiceDetails';
import { ServiceRequest } from '../../types/services';
import { AlertTriangle, CheckCircle, MessageCircle } from 'lucide-react-native';

type FilterType = 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'INCIDENTS';

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pendiente',
    ACCEPTED: 'Asignado',
    IN_PROGRESS: 'En Proceso',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
};

export const AdminDashboard = () => {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { data: services, isLoading, error } = useAdminServices();
    
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);

    const filteredServices = useMemo(() => {
        if (!services) return [];
        return services.filter(service => {
            if (filter === 'ALL') return true;
            if (filter === 'INCIDENTS') return service.incidents && service.incidents.length > 0;
            return service.status === filter;
        });
    }, [services, filter]);

    const FilterChip = ({ type, label }: { type: FilterType, label: string }) => (
        <TouchableOpacity 
            style={[styles.filterChip, filter === type && styles.filterChipActive]}
            onPress={() => setFilter(type)}
        >
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderServiceCard = ({ item }: { item: ServiceRequest }) => (
        <TouchableOpacity style={styles.card} onPress={() => setSelectedService(item)}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>#{item.id} - {item.category_name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'COMPLETED' ? colors.success : colors.primary }]}>
                    <Text style={styles.statusText}>{STATUS_LABELS[item.status || 'PENDING']}</Text>
                </View>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                    <Text style={styles.strongText}>Cliente:</Text> {item.client_name || item.client_email}
                </Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                    <Text style={styles.strongText}>Operaria:</Text> {item.worker_name || item.worker_email || 'No asignada'}
                </Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                    <Text style={styles.strongText}>Fecha:</Text> {new Date(item.scheduled_at).toLocaleDateString()}
                </Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {item.incidents && item.incidents.filter(i => i.status === 'OPEN').length > 0 && (
                    <View style={styles.incidentBadge}>
                        <AlertTriangle size={14} color={colors.danger} />
                        <Text style={styles.incidentText}>{item.incidents.filter(i => i.status === 'OPEN').length} Incidencia(s)</Text>
                    </View>
                )}
                {item.is_billed && (
                    <View style={styles.billedBadge}>
                        <CheckCircle size={14} color={colors.success} />
                        <Text style={styles.billedText}>Facturado</Text>
                    </View>
                )}
                {(item.unread_messages_count || 0) > 0 && (
                    <View style={[styles.billedBadge, { backgroundColor: colors.danger + '15', borderColor: colors.danger + '50', borderWidth: 1 }]}>
                        <MessageCircle size={14} color={colors.danger} />
                        <Text style={[styles.billedText, { color: colors.danger, fontWeight: '700' }]}>{item.unread_messages_count} mensaje(s)</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Seguimiento de Servicios</Text>
                <Text style={styles.headerSubtitle}>Panel de Monitoreo Administrativo</Text>
            </View>

            <View style={{ paddingBottom: 15 }}>
                <FlatList 
                    horizontal
                    data={[
                        { type: 'ALL', label: 'Todos' },
                        { type: 'PENDING', label: 'Pendientes' },
                        { type: 'IN_PROGRESS', label: 'En Curso' },
                        { type: 'COMPLETED', label: 'Completados' },
                        { type: 'INCIDENTS', label: 'Incidencias' },
                    ]}
                    keyExtractor={(item) => item.type}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    renderItem={({ item }) => <FilterChip type={item.type as FilterType} label={item.label} />}
                />
            </View>

            {isLoading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : error ? (
                <Text style={styles.errorText}>No se pudieron cargar los servicios. Reintente más tarde.</Text>
            ) : (
                <FlatList 
                    data={filteredServices}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    renderItem={renderServiceCard}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textMuted }}>No hay servicios que coincidan con el filtro.</Text>
                    }
                />
            )}

            <AdminServiceDetails 
                service={selectedService} 
                visible={!!selectedService} 
                onClose={() => setSelectedService(null)} 
            />
        </View>
    );
};
