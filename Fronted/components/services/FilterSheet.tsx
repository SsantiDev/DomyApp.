import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { X, SlidersHorizontal, Check } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS } from '../../constants/theme';
import { useCategories } from '../../hooks/useServices';
import { ServiceHistoryFilters } from '../../hooks/useServices';

interface Props {
    visible: boolean;
    filters: ServiceHistoryFilters;
    onApply: (filters: ServiceHistoryFilters) => void;
    onClose: () => void;
}

const toDateString = (d: Date) => d.toISOString().split('T')[0];

export const FilterSheet = ({ visible, filters, onApply, onClose }: Props) => {
    const { colors } = useTheme();
    const { data: categories } = useCategories();

    const [startDate, setStartDate] = useState<Date | null>(
        filters.start_date ? new Date(filters.start_date) : null
    );
    const [endDate, setEndDate] = useState<Date | null>(
        filters.end_date ? new Date(filters.end_date) : null
    );
    const [categoryId, setCategoryId] = useState<number | undefined>(filters.category);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const handleApply = () => {
        onApply({
            start_date: startDate ? toDateString(startDate) : undefined,
            end_date: endDate ? toDateString(endDate) : undefined,
            category: categoryId,
        });
        onClose();
    };

    const handleClear = () => {
        setStartDate(null);
        setEndDate(null);
        setCategoryId(undefined);
        onApply({});
        onClose();
    };

    const labelStyle = useMemo(() => ({ fontSize: 13, fontWeight: '600' as const, color: colors.textLight, marginBottom: SPACING.xs }), [colors]);
    const dateButtonStyle = useMemo(() => ({
        borderWidth: 1, borderColor: colors.border, borderRadius: RADIUS.md,
        padding: SPACING.sm, backgroundColor: colors.surface,
    }), [colors]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ backgroundColor: colors.background, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl, maxHeight: '80%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SlidersHorizontal size={18} color={colors.primary} />
                            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginLeft: SPACING.xs }}>Filtros</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}><X size={20} color={colors.text} /></TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Date range */}
                        <View style={{ marginBottom: SPACING.md }}>
                            <Text style={labelStyle}>Desde</Text>
                            <TouchableOpacity style={dateButtonStyle} onPress={() => setShowStartPicker(true)}>
                                <Text style={{ color: startDate ? colors.text : colors.textLight }}>
                                    {startDate ? toDateString(startDate) : 'Seleccionar fecha'}
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

                        <View style={{ marginBottom: SPACING.md }}>
                            <Text style={labelStyle}>Hasta</Text>
                            <TouchableOpacity style={dateButtonStyle} onPress={() => setShowEndPicker(true)}>
                                <Text style={{ color: endDate ? colors.text : colors.textLight }}>
                                    {endDate ? toDateString(endDate) : 'Seleccionar fecha'}
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

                        {/* Category filter */}
                        <View style={{ marginBottom: SPACING.lg }}>
                            <Text style={labelStyle}>Categoría</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs }}>
                                {categories?.map(cat => {
                                    const selected = categoryId === cat.id;
                                    return (
                                        <TouchableOpacity
                                            key={cat.id}
                                            onPress={() => setCategoryId(selected ? undefined : cat.id)}
                                            style={{
                                                flexDirection: 'row', alignItems: 'center',
                                                paddingVertical: 6, paddingHorizontal: SPACING.sm,
                                                borderRadius: RADIUS.full ?? 999,
                                                borderWidth: 1,
                                                borderColor: selected ? colors.primary : colors.border,
                                                backgroundColor: selected ? colors.primary + '15' : colors.surface,
                                            }}
                                        >
                                            {selected && <Check size={12} color={colors.primary} style={{ marginRight: 4 }} />}
                                            <Text style={{ fontSize: 13, color: selected ? colors.primary : colors.text, fontWeight: selected ? '600' : '400' }}>
                                                {cat.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>

                    <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm }}>
                        <TouchableOpacity
                            onPress={handleClear}
                            style={{ flex: 1, padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}
                        >
                            <Text style={{ color: colors.textLight, fontWeight: '600' }}>Limpiar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleApply}
                            style={{ flex: 2, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: colors.primary, alignItems: 'center' }}
                        >
                            <Text style={{ color: colors.white, fontWeight: '700' }}>Aplicar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
