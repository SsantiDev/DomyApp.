import React from 'react';
import { View } from 'react-native';
import { Clock, CheckCircle } from 'lucide-react-native';
import { Button } from '../ui/NativeButton';

interface WorkerActionsProps {
    isWorker: boolean;
    serviceStatus: string | undefined;
    canWorkerCancel: boolean;
    onStart: () => void;
    onComplete: () => void;
    onCancel: () => void;
    startLoading: boolean;
    completeLoading: boolean;
    cancelLoading: boolean;
    colors: any;
    styles: any;
}

export const WorkerActions = ({
    isWorker,
    serviceStatus,
    canWorkerCancel,
    onStart,
    onComplete,
    onCancel,
    startLoading,
    completeLoading,
    cancelLoading,
    colors,
    styles,
}: WorkerActionsProps) => {
    if (!isWorker) return null;

    return (
        <View style={styles.actionsContainer}>
            {serviceStatus === 'ACCEPTED' && (
                <Button
                    title="Iniciar Labor"
                    onPress={onStart}
                    loading={startLoading}
                    icon={<Clock size={20} color="#ffffff" />}
                />
            )}
            {serviceStatus === 'IN_PROGRESS' && (
                <Button
                    title="Finalizar Labor"
                    onPress={onComplete}
                    style={{ backgroundColor: colors.success }}
                    loading={completeLoading}
                    icon={<CheckCircle size={20} color="#ffffff" />}
                />
            )}
            {canWorkerCancel && (
                <Button
                    title="Abandonar servicio"
                    onPress={onCancel}
                    variant="outline"
                    style={{ borderColor: colors.danger, marginTop: 10 }}
                    textStyle={{ color: colors.danger }}
                    loading={cancelLoading}
                />
            )}
        </View>
    );
};
