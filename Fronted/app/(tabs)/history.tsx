import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NativeMainLayout } from '../../components/layout/NativeMainLayout';
import ClientHistory from '../../components/dashboard/ClientHistory';
import WorkerHistory from '../../components/dashboard/WorkerHistory';

export default function HistoryScreen() {
    const { user, isLoading } = useAuth();
    const { colors } = useTheme();

    if (isLoading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NativeMainLayout>
            {user?.role === 'WORKER' ? <WorkerHistory /> : <ClientHistory />}
        </NativeMainLayout>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
