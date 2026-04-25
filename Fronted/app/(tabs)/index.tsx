import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ClientDashboard from '../../components/dashboard/ClientDashboard';
import WorkerDashboard from '../../components/dashboard/WorkerDashboard';
import { Text } from '@/components/Themed';
import { NativeMainLayout } from '../../components/layout/NativeMainLayout';
import { AdminDashboardScreen } from '../admin-dashboard';
import { useNotificationsWS } from '../../hooks/useNotificationsWS';
import { getAccessToken } from '../../services/authStorage';

export default function TabIndexScreen() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getAccessToken().then(setToken);
  }, [user]);

  useNotificationsWS({
    token,
    enabled: !isLoading && !!user,
  });

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
      {user.role === 'ADMIN' ? <AdminDashboardScreen /> : user.role === 'WORKER' ? <WorkerDashboard /> : <ClientDashboard />}
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
