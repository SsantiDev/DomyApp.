import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../ui/NativeCard';

interface StatusSectionProps {
    colors: any;
    styles: any;
    status: string;
}

export const StatusSection = ({ colors, styles, status }: StatusSectionProps) => {
    const statusLabel = status === 'ACCEPTED'
        ? 'Programada'
        : status === 'IN_PROGRESS'
            ? 'En ejecución'
            : status === 'COMPLETED'
                ? 'Finalizada con éxito'
                : status;

    return (
        <View style={styles.statusSection}>
            <Card variant="flat" style={styles.statusCard}>
                <View style={styles.statusHeader}>
                    <View>
                        <Text style={[styles.statusLabel, { color: colors.textLight }]}>Estado de la Labor</Text>
                        <Text style={[styles.statusValueText, { color: colors.text }]}>
                            {statusLabel}
                        </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: status === 'COMPLETED' ? colors.success + '15' : colors.primary + '10' }]}>
                        <View style={[styles.dot, { backgroundColor: status === 'COMPLETED' ? colors.success : colors.primary }]} />
                        <Text style={[styles.badgeText, { color: status === 'COMPLETED' ? colors.success : colors.primary }]}>
                            {status}
                        </Text>
                    </View>
                </View>
            </Card>
        </View>
    );
};
