import React from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ClientDashboard from '../../components/dashboard/ClientDashboard';
import WorkerDashboard from '../../components/dashboard/WorkerDashboard';
import { Text } from '@/components/Themed';

export default function TabOneScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Por favor, inicia sesión para continuar.</Text>
      </View>
    );
  }

  // Despacho por Rol
  return user.role === 'WORKER' ? <WorkerDashboard /> : <ClientDashboard />;
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
