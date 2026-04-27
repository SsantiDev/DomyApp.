import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    ListRenderItemInfo,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING } from '../../constants/theme';
import { useServiceHistory, ServiceHistoryFilters } from '../../hooks/useServices';
import { ServiceRequest } from '../../types/services';
import { getStyles } from './ClientHistory.styles';
import { Clock, User, Calendar, Star, XCircle, CheckCircle, SlidersHorizontal } from 'lucide-react-native';
import { FilterSheet } from '../services/FilterSheet';

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

function HistoryCard({ item, colors, styles }: { item: ServiceRequest; colors: any; styles: any }) {
    const isCompleted = item.status === 'COMPLETED';
    const accentColor = isCompleted ? colors.success : colors.textMuted;
    const badgeBg = isCompleted ? colors.success + '18' : colors.border;

    return (
        <View style={styles.card}>
            <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />
            <View style={styles.cardBody}>
                {/* Top row: category + status badge */}
                <View style={styles.cardTopRow}>
                    <Text style={styles.categoryName} numberOfLines={1}>
                        {item.category_name}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                        {isCompleted ? (
                            <CheckCircle size={10} color={accentColor} />
                        ) : (
                            <XCircle size={10} color={accentColor} />
                        )}
                        <Text style={[styles.statusText, { color: accentColor }]}>
                            {isCompleted ? 'Completado' : 'Cancelado'}
                        </Text>
                    </View>
                </View>

                {/* Worker */}
                {item.worker_name && (
                    <View style={styles.metaRow}>
                        <User size={13} color={colors.textMuted} />
                        <Text style={styles.metaText}>{item.worker_name}</Text>
                    </View>
                )}

                {/* Date */}
                <View style={styles.metaRow}>
                    <Calendar size={13} color={colors.textMuted} />
                    <Text style={styles.metaText}>{formatDate(item.scheduled_at)}</Text>
                </View>

                {/* Price */}
                {item.total_price && (
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>
                            Pagado:{' '}
                            <Text style={styles.priceText}>
                                ${Number(item.total_price).toLocaleString()}
                            </Text>
                        </Text>
                    </View>
                )}

                {/* Star rating (only if reviewed) */}
                {isCompleted && item.review && (
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star
                                key={s}
                                size={14}
                                color={s <= item.review!.rating ? colors.warning : colors.border}
                                fill={s <= item.review!.rating ? colors.warning : 'transparent'}
                            />
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}

function EmptyState({ colors, styles }: { colors: any; styles: any }) {
    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
                <Clock size={36} color={colors.textMuted} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No tenés servicios anteriores</Text>
            <Text style={styles.emptySubtitle}>
                Tus servicios completados y cancelados{'\n'}aparecerán aquí.
            </Text>
        </View>
    );
}

export default function ClientHistory() {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [filters, setFilters] = useState<ServiceHistoryFilters>({});
    const [showFilters, setShowFilters] = useState(false);
    const { data, isLoading } = useServiceHistory(filters);

    const hasActiveFilters = !!(filters.start_date || filters.end_date || filters.category);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <>
        <FlatList
            style={styles.container}
            contentContainerStyle={[
                styles.scrollContent,
                (!data || data.length === 0) && { flex: 1 },
            ]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View style={styles.pageHeader}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.pageTitle}>Historial</Text>
                            <Text style={styles.pageSubtitle}>
                                {data && data.length > 0
                                    ? `${data.length} servicio${data.length !== 1 ? 's' : ''} en tu historial`
                                    : 'Sin servicios anteriores'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowFilters(true)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: SPACING.sm,
                                paddingVertical: SPACING.xs,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: hasActiveFilters ? colors.primary : colors.border,
                                backgroundColor: hasActiveFilters ? colors.primary + '15' : 'transparent',
                                gap: 4,
                            }}
                        >
                            <SlidersHorizontal size={14} color={hasActiveFilters ? colors.primary : colors.textLight} />
                            <Text style={{ fontSize: 12, fontWeight: '600', color: hasActiveFilters ? colors.primary : colors.textLight }}>
                                Filtros{hasActiveFilters ? ' ●' : ''}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            data={data ?? []}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }: ListRenderItemInfo<ServiceRequest>) => (
                <HistoryCard item={item} colors={colors} styles={styles} />
            )}
            ItemSeparatorComponent={() => <View style={{ height: SPACING.xs }} />}
            ListEmptyComponent={<EmptyState colors={colors} styles={styles} />}
        />
        <FilterSheet
            visible={showFilters}
            filters={filters}
            onApply={setFilters}
            onClose={() => setShowFilters(false)}
        />
        </>
    );
}
