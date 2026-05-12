import React from 'react';
import { View, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { Button } from '../ui/NativeButton';

interface ClientActionsProps {
    canClientCancel: boolean;
    canClientReschedule: boolean;
    showReschedulePicker: boolean;
    rescheduleDate: Date;
    reschedulePickerMode: 'date' | 'time';
    onShowReschedulePicker: () => void;
    onReschedulePickerChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
    onConfirmReschedule: () => void;
    onCancel: () => void;
    rescheduleLoading: boolean;
    cancelLoading: boolean;
    colors: any;
    styles: any;
}

export const ClientActions = ({
    canClientCancel,
    canClientReschedule,
    showReschedulePicker,
    rescheduleDate,
    reschedulePickerMode,
    onShowReschedulePicker,
    onReschedulePickerChange,
    onConfirmReschedule,
    onCancel,
    rescheduleLoading,
    cancelLoading,
    colors,
    styles,
}: ClientActionsProps) => {
    if (!canClientCancel && !canClientReschedule) return null;

    return (
        <View style={[styles.actionsContainer, { gap: 10 }]}>
            {canClientReschedule && (
                <Button
                    title="Reprogramar Servicio"
                    onPress={onShowReschedulePicker}
                    loading={rescheduleLoading}
                    icon={<Calendar size={20} color="#ffffff" />}
                />
            )}
            {canClientCancel && (
                <Button
                    title="Cancelar servicio"
                    onPress={onCancel}
                    variant="outline"
                    style={{ borderColor: colors.danger }}
                    textStyle={{ color: colors.danger }}
                    loading={cancelLoading}
                />
            )}

            {showReschedulePicker && (
                <DateTimePicker
                    value={rescheduleDate}
                    mode={reschedulePickerMode}
                    is24Hour={false}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onReschedulePickerChange}
                    minimumDate={new Date()}
                />
            )}
            {Platform.OS === 'ios' && showReschedulePicker && (
                <Button
                    title="Confirmar Nueva Fecha"
                    variant="outline"
                    style={{ marginTop: 8 }}
                    onPress={onConfirmReschedule}
                />
            )}
        </View>
    );
};
