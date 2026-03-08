import React from 'react';
import { StyleSheet, View, Text, Switch, ScrollView, Alert } from 'react-native';
import { useWorkerAvailability } from '../../hooks/useWorkerAvailability';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { Card } from '../ui/NativeCard';

export default function WorkerDashboard() {
  const { colors, isDark } = useTheme();
  const { isAvailable, loading, handleToggle } = useWorkerAvailability();

  const onToggle = async () => {
    try {
      await handleToggle();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudo cambiar la disponibilidad');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>Mi Perfil de Trabajo</Text>
        <View style={styles.toggleContainer}>
          <Text style={[styles.toggleLabel, { color: colors.textLight }]}>
            {isAvailable ? 'Disponible' : 'No disponible'}
          </Text>
          <Switch
            value={isAvailable}
            onValueChange={onToggle}
            disabled={loading}
            trackColor={{ false: colors.secondary, true: colors.primary + '80' }}
            thumbColor={isAvailable ? colors.warning : colors.surface}
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={[styles.statTitle, { color: colors.secondary }]}>Ganancias</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>$0.00</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statTitle, { color: colors.secondary }]}>Servicios Hoy</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>0</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Servicios Pendientes</Text>
        <Card style={styles.emptyState} variant="outlined">
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No tienes servicios asignados aún.</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl
  },
  greeting: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  toggleLabel: {
    marginRight: SPACING.sm,
    fontSize: TYPOGRAPHY.small.fontSize,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl
  },
  statCard: {
    width: '48%',
  },
  statTitle: {
    fontSize: TYPOGRAPHY.small.fontSize,
    marginBottom: SPACING.xs
  },
  statValue: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
  },
  section: {
    marginBottom: SPACING.xl
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    marginBottom: SPACING.md,
  },
  emptyState: {
    padding: SPACING.xxl,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body.fontSize,
  },
});
