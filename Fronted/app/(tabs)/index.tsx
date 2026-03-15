import React from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ClientDashboard from '../../components/dashboard/ClientDashboard';
import WorkerDashboard from '../../components/dashboard/WorkerDashboard';
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeMainLayout } from '../../components/layout/NativeMainLayout';

export default function TabIndexScreen() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Por favor, inicia sesión para continuar.</Text>
      </View>
    );
  }

  return (
    <NativeMainLayout>
      {user.role === 'WORKER' ? <WorkerDashboard /> : <ClientDashboard />}
    </NativeMainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  }
});
