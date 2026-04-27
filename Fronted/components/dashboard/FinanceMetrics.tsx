import React, { useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAdminFinanceSummary } from '../../hooks/useAdmin';
import { getStyles } from './FinanceMetrics.styles';

type AdminMetric = {
    label: string;
    value: number | string;
    trend: 'up' | 'down' | 'neutral';
};

const MOCK_MONTHLY = [
    { month: 'Ene', value: 0 },
    { month: 'Feb', value: 0 },
    { month: 'Mar', value: 0 },
    { month: 'Abr', value: 0 },
];

export function FinanceMetrics() {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { data, isLoading } = useAdminFinanceSummary();

    if (isLoading) {
        return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />;
    }

    const metrics: AdminMetric[] = [
        { label: 'Ingresos Totales', value: `$${(data?.total_revenue ?? 0).toFixed(2)}`, trend: 'neutral' },
        { label: 'Comisiones', value: `$${(data?.platform_commissions ?? 0).toFixed(2)}`, trend: 'up' },
        { label: 'Pagos Pendientes', value: `$${(data?.pending_payouts ?? 0).toFixed(2)}`, trend: 'neutral' },
    ];

    const maxBarValue = Math.max(...MOCK_MONTHLY.map(m => m.value), 1);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Finanzas</Text>

            <View style={styles.cardsRow}>
                {metrics.map(m => (
                    <View key={m.label} style={styles.card}>
                        <Text style={styles.cardLabel}>{m.label}</Text>
                        <Text style={styles.cardValue}>{m.value}</Text>
                        <Text style={m.trend === 'up' ? styles.trendUp : m.trend === 'down' ? styles.trendDown : styles.trendNeutral}>
                            {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '—'}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>Ingresos por mes</Text>
                {MOCK_MONTHLY.map(item => (
                    <View key={item.month} style={styles.barRow}>
                        <Text style={styles.barLabel}>{item.month}</Text>
                        <View style={styles.barTrack}>
                            <View style={[styles.barFill, { width: `${(item.value / maxBarValue) * 100}%`, backgroundColor: colors.primary }]} />
                        </View>
                        <Text style={styles.barValue}>${item.value}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.note}>Datos reales disponibles al integrar pasarela de pagos</Text>
        </ScrollView>
    );
}
