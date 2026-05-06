import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAdminFinanceSummary } from '../../hooks/useAdmin';
import { getStyles } from './FinanceMetrics.styles';
import { getAccessToken } from '../../services/authStorage';
import { API_URL } from '../../config/env';
import { FileSpreadsheet, FileText } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type AdminMetric = {
    label: string;
    value: number | string;
    trend: 'up' | 'down' | 'neutral';
};

const toDateString = (d: Date | null) => {
    if (!d) return undefined;
    return d.toISOString().split('T')[0];
};

export function FinanceMetrics() {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const startDateStr = useMemo(() => toDateString(startDate), [startDate]);
    const endDateStr = useMemo(() => toDateString(endDate), [endDate]);

    const { data, isLoading } = useAdminFinanceSummary(startDateStr, endDateStr);

    const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

    const handleClearFilters = () => {
        setStartDate(null);
        setEndDate(null);
    };

    const handleDownloadExcel = async () => {
        setIsDownloadingExcel(true);
        try {
            const token = await getAccessToken();
            if (!token) {
                Alert.alert('Error', 'No se pudo obtener el token de autenticación.');
                return;
            }
            let downloadUrl = `${API_URL}/api/admin/finance/export/excel/?token=${token}`;
            if (startDateStr) downloadUrl += `&start_date=${startDateStr}`;
            if (endDateStr) downloadUrl += `&end_date=${endDateStr}`;
            
            await Linking.openURL(downloadUrl);
        } catch (error) {
            console.error('Error opening excel download link:', error);
            Alert.alert('Error', 'No se pudo descargar el reporte de Excel.');
        } finally {
            setIsDownloadingExcel(false);
        }
    };

    const handleDownloadPDF = async () => {
        setIsDownloadingPDF(true);
        try {
            const token = await getAccessToken();
            if (!token) {
                Alert.alert('Error', 'No se pudo obtener el token de autenticación.');
                return;
            }
            let downloadUrl = `${API_URL}/api/admin/finance/export/pdf/?token=${token}`;
            if (startDateStr) downloadUrl += `&start_date=${startDateStr}`;
            if (endDateStr) downloadUrl += `&end_date=${endDateStr}`;
            
            await Linking.openURL(downloadUrl);
        } catch (error) {
            console.error('Error opening pdf download link:', error);
            Alert.alert('Error', 'No se pudo descargar el reporte de PDF.');
        } finally {
            setIsDownloadingPDF(false);
        }
    };

    const metrics: AdminMetric[] = useMemo(() => {
        return [
            { label: 'Ingresos Totales', value: `$${(data?.total_revenue ?? 0).toFixed(2)}`, trend: 'neutral' },
            { label: 'Comisiones', value: `$${(data?.platform_commissions ?? 0).toFixed(2)}`, trend: 'up' },
            { label: 'Pagos Pendientes', value: `$${(data?.pending_payouts ?? 0).toFixed(2)}`, trend: 'neutral' },
        ];
    }, [data]);

    const monthlyRevenues = useMemo(() => {
        return data?.monthly_revenues || [];
    }, [data]);

    const maxBarValue = useMemo(() => {
        return Math.max(...monthlyRevenues.map(m => m.value), 1);
    }, [monthlyRevenues]);

    if (isLoading) {
        return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Finanzas</Text>

            {/* Filtro de Fechas */}
            <View style={styles.filterCard}>
                <Text style={styles.filterTitle}>Filtrar por Fechas</Text>
                
                <View style={styles.filterInputsRow}>
                    <View style={styles.filterInputCol}>
                        <Text style={styles.filterInputLabel}>Desde</Text>
                        <TouchableOpacity style={styles.filterInputBtn} onPress={() => setShowStartPicker(true)}>
                            <Text style={[styles.filterInputText, { color: startDate ? colors.text : colors.textLight }]}>
                                {startDate ? startDate.toISOString().split('T')[0] : 'Seleccionar'}
                            </Text>
                        </TouchableOpacity>
                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate ?? new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(_: DateTimePickerEvent, d?: Date) => {
                                    setShowStartPicker(false);
                                    if (d) setStartDate(d);
                                }}
                            />
                        )}
                    </View>

                    <View style={styles.filterInputCol}>
                        <Text style={styles.filterInputLabel}>Hasta</Text>
                        <TouchableOpacity style={styles.filterInputBtn} onPress={() => setShowEndPicker(true)}>
                            <Text style={[styles.filterInputText, { color: endDate ? colors.text : colors.textLight }]}>
                                {endDate ? endDate.toISOString().split('T')[0] : 'Seleccionar'}
                            </Text>
                        </TouchableOpacity>
                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate ?? new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(_: DateTimePickerEvent, d?: Date) => {
                                    setShowEndPicker(false);
                                    if (d) setEndDate(d);
                                }}
                            />
                        )}
                    </View>
                </View>

                {(startDate || endDate) && (
                    <TouchableOpacity style={styles.clearFilterBtn} onPress={handleClearFilters}>
                        <Text style={styles.clearFilterText}>Limpiar Filtros</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Tarjetas de Métricas */}
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

            {/* Gráfico de Ingresos por Mes */}
            <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>Ingresos por mes</Text>
                {monthlyRevenues.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: colors.textLight, marginVertical: SPACING.md, fontSize: 13, fontStyle: 'italic' }}>
                        No hay ingresos registrados en este periodo
                    </Text>
                ) : (
                    monthlyRevenues.map(item => (
                        <View key={item.key} style={styles.barRow}>
                            <Text style={styles.barLabel}>{item.key}</Text>
                            <View style={styles.barTrack}>
                                <View style={[styles.barFill, { width: `${(item.value / maxBarValue) * 100}%`, backgroundColor: colors.primary }]} />
                            </View>
                            <Text style={styles.barValue}>${item.value.toFixed(2)}</Text>
                        </View>
                    ))
                )}
            </View>

            {/* Exportación */}
            <View style={styles.exportSection}>
                <Text style={styles.exportTitle}>Exportar Reportes</Text>
                <View style={styles.exportButtonsRow}>
                    <TouchableOpacity 
                        style={[styles.exportButton, { backgroundColor: colors.success + '15', borderColor: colors.success + '40' }]} 
                        onPress={handleDownloadExcel}
                        disabled={isDownloadingExcel}
                    >
                        {isDownloadingExcel ? (
                            <ActivityIndicator size="small" color={colors.success} />
                        ) : (
                            <>
                                <FileSpreadsheet size={16} color={colors.success} />
                                <Text style={[styles.exportButtonText, { color: colors.success }]}>Excel</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.exportButton, { backgroundColor: colors.danger + '15', borderColor: colors.danger + '40' }]} 
                        onPress={handleDownloadPDF}
                        disabled={isDownloadingPDF}
                    >
                        {isDownloadingPDF ? (
                            <ActivityIndicator size="small" color={colors.danger} />
                        ) : (
                            <>
                                <FileText size={16} color={colors.danger} />
                                <Text style={[styles.exportButtonText, { color: colors.danger }]}>PDF</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.note}>Datos reales disponibles al integrar pasarela de pagos</Text>
        </ScrollView>
    );
}
