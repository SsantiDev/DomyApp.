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
import { getStyles } from './WorkerHistory.styles';
import {
    Clock,
    User,
    Calendar,
    Star,
    XCircle,
    CheckCircle,
    Wallet,
    Briefcase,
    SlidersHorizontal,
} from 'lucide-react-native';
import { FilterSheet } from '../services/FilterSheet';

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

// Stats header sub-component
function StatsHeader({ data, colors, styles }: { data: ServiceRequest[]; colors: any; styles: any }) {
    const completed = useMemo(() => data.filter(r => r.status === 'COMPLETED'), [data]);

    const totalEarned = useMemo(
        () => completed.reduce((sum, r) => sum + Number(r.total_price ?? 0), 0),
        [completed]
    );

    const reviewedItems = useMemo(
        () => completed.filter(r => r.review),
        [completed]
    );

    const averageRating = useMemo(() => {
        if (reviewedItems.length === 0) return 0;
        const sum = reviewedItems.reduce((acc, r) => acc + (r.review?.rating ?? 0), 0);
        return sum / reviewedItems.length;
    }, [reviewedItems]);

    return (
        <View style={styles.statsRow}>
            {/* Hero: Ganancias — full width */}
            <View style={[styles.statCardBase, styles.statCardHero]}>
                <View style={styles.statHeroLeft}>
                    <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
                        <Wallet size={22} color={colors.primary} />
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Text style={styles.statHeroLabel}>Ganancias Totales</Text>
                        <Text style={styles.statHeroSub}>Total acumulado</Text>
                    </View>
                </View>
                <Text style={styles.statHeroValue}>${totalEarned.toLocaleString()}</Text>
            </View>

            {/* Fila secundaria: Rating + Labores */}
            <View style={styles.statsSecondaryRow}>
                <View style={[styles.statCardBase, styles.statCardSecondary, styles.statCardRating]}>
                    <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
                        <Star size={22} color={colors.success} />
                    </View>
                    <Text style={styles.statValue}>
                        {reviewedItems.length > 0 ? averageRating.toFixed(1) : '-'}
                    </Text>
                    <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={[styles.statCardBase, styles.statCardSecondary, styles.statCardJobs]}>
                    <View style={[styles.statIcon, { backgroundColor: colors.warning + '15' }]}>
                        <Briefcase size={22} color={colors.warning} />
                    </View>
                    <Text style={styles.statValue}>{completed.length}</Text>
                    <Text style={styles.statLabel}>Labores</Text>
                </View>
            </View>
        </View>
    );
}

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

                {/* Client */}
                {item.client_name && (
                    <View style={styles.metaRow}>
                        <User size={13} color={colors.textMuted} />
                        <Text style={styles.metaText}>{item.client_name}</Text>
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
                            Ganado:{' '}
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

export default function WorkerHistory() {
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

    const items = data ?? [];

    return (
        <>
        <FlatList
            style={styles.container}
            contentContainerStyle={[
                styles.scrollContent,
                items.length === 0 && { flex: 1 },
            ]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View>
                    <View style={styles.pageHeader}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.pageTitle}>Historial</Text>
                                <Text style={styles.pageSubtitle}>
                                    {items.length > 0
                                        ? `${items.length} servicio${items.length !== 1 ? 's' : ''} en tu historial`
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
                    {items.length > 0 && (
                        <StatsHeader data={items} colors={colors} styles={styles} />
                    )}
                    {items.length > 0 && (
                        <Text style={styles.sectionTitle}>Todos los servicios</Text>
                    )}
                </View>
            }
            data={items}
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
