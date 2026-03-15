import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Switch, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkerAvailability } from '../../hooks/useWorkerAvailability';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { Card } from '../ui/NativeCard';
import { Button } from '../ui/NativeButton';
import { useServiceRequests, useAcceptService } from '../../hooks/useServices';
import { Briefcase, Clock, MapPin, CheckCircle, Wallet, Calendar, ChevronRight, Bell, Star } from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';

export default function WorkerDashboard() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { isAvailable, loading: loadingAvail, handleToggle } = useWorkerAvailability();
  const { data: requests, isLoading: loadingRequests } = useServiceRequests();
  const acceptService = useAcceptService();

  const onToggle = async () => {
    try {
      await handleToggle();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudo cambiar la disponibilidad');
    }
  };

  const handleAccept = async (id: number) => {
    try {
      await acceptService.mutateAsync(id);
      Alert.alert('¡Éxito!', 'Has aceptado el servicio correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo aceptar el servicio.');
    }
  };

  const pendingRequests = useMemo(() =>
    requests?.filter(r => r.status === 'PENDING') || [],
    [requests]);

  const activeRequests = useMemo(() =>
    requests?.filter(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS') || [],
    [requests]);

  const completedWithReviews = useMemo(() =>
    requests?.filter(r => r.status === 'COMPLETED' && r.review).slice(0, 3) || [],
    [requests]);

  const completedCount = useMemo(() =>
    requests?.filter(r => r.status === 'COMPLETED').length || 0,
    [requests]);

  const totalEarnings = useMemo(() =>
    requests?.filter(r => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + Number(r.total_price), 0) || 0,
    [requests]);

  const averageRating = user?.profile?.average_rating || 0;

  if (loadingRequests) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Panel de Trabajo</Text>
            <Text style={[styles.subtitle, { color: colors.textLight }]}>Hoy tienes {activeRequests.length} labores activas</Text>
          </View>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Bell size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <Card style={[styles.availabilityCard, { backgroundColor: isAvailable ? colors.primary : colors.surface, borderColor: colors.border }]}>
          <View style={styles.availInfo}>
            <View style={[styles.statusIndicator, { backgroundColor: isAvailable ? '#4ADE80' : colors.textMuted }]} />
            <Text style={[styles.availText, { color: isAvailable ? colors.white : colors.text }]}>
              Estas {isAvailable ? 'en línea para recibir' : 'fuera de linea, activa para ver'} solicitudes
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={onToggle}
            disabled={loadingAvail}
            trackColor={{ false: colors.border, true: 'rgba(255,255,255,0.3)' }}
            thumbColor={colors.white}
          />
        </Card>
      </View>

      {/* Stats Section */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard} variant="flat">
          <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
            <Wallet size={20} color={colors.primary} />
          </View>
          <View style={styles.statInfo}>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Ganancias</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>${totalEarnings.toLocaleString()}</Text>
          </View>
        </Card>
        <Card style={styles.statCard} variant="flat">
          <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
            <Briefcase size={20} color={colors.success} />
          </View>
          <View style={styles.statInfo}>
            <Text style={[styles.statLabel, { color: colors.textLight }]}>Labores</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{completedCount}</Text>
          </View>
        </Card>
      </View>

      {/* Dynamic Sections */}
      <View style={styles.mainContent}>
        {/* Active Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mis Labores Activas</Text>
            {activeRequests.length > 0 && <Text style={[styles.badge, { backgroundColor: colors.primary + '15', color: colors.primary }]}>{activeRequests.length}</Text>}
          </View>

          {activeRequests.length > 0 ? (
            activeRequests.map(req => (
              <Card key={req.id} style={styles.serviceCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryTitle, { color: colors.text }]}>{req.category_name}</Text>
                    <View style={styles.row}>
                      <Clock size={12} color={colors.textLight} />
                      <Text style={[styles.timeText, { color: colors.textLight }]}>{new Date(req.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: req.status === 'IN_PROGRESS' ? colors.warning + '15' : colors.success + '15' }]}>
                    <Text style={[styles.statusText, { color: req.status === 'IN_PROGRESS' ? colors.warning : colors.success }]}>
                      {req.status === 'IN_PROGRESS' ? 'En Labor' : 'Asignado'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.detailRow}>
                    <MapPin size={14} color={colors.textLight} />
                    <Text style={[styles.detailText, { color: colors.text }]}>{req.address}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.cardFooter, { borderTopColor: colors.border }]}
                  onPress={() => router.push(`/service-detail/${req.id}`)}
                >
                  <Text style={[styles.footerLink, { color: colors.primary }]}>Ver detalles y mapa</Text>
                  <ChevronRight size={16} color={colors.primary} />
                </TouchableOpacity>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard} variant="outlined">
              <Clock size={32} color={colors.textMuted} strokeWidth={1} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>No tienes servicios próximos</Text>
            </Card>
          )}
        </View>

        {/* Recent Reviews */}
        {completedWithReviews.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Reseñas Recientes</Text>
              <Text style={[styles.badge, { backgroundColor: colors.warning + '15', color: colors.warning }]}>{completedWithReviews.length}</Text>
            </View>
            {completedWithReviews.map(req => (
              <TouchableOpacity
                key={req.id}
                onPress={() => router.push(`/service-detail/${req.id}`)}
              >
                <Card style={[styles.reviewItem, { backgroundColor: colors.surface }]}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewCategory, { color: colors.text }]}>{req.category_name}</Text>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          size={12}
                          color={s <= (req.review?.rating || 0) ? colors.warning : colors.border}
                          fill={s <= (req.review?.rating || 0) ? colors.warning : 'transparent'}
                        />
                      ))}
                    </View>
                  </View>
                  {req.review?.comment && (
                    <Text style={[styles.reviewText, { color: colors.textLight }]} numberOfLines={2}>
                      "{req.review.comment}"
                    </Text>
                  )}
                  <Text style={[styles.reviewDate, { color: colors.textMuted }]}>
                    {new Date(req.completed_at || req.scheduled_at).toLocaleDateString()}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Available Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Servicios Disponibles</Text>
          </View>

          {!isAvailable ? (
            <Card style={[styles.offlineCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.offlineText, { color: colors.textLight }]}>Active su perfil para ver las solicitudes de hoy</Text>
            </Card>
          ) : pendingRequests.length > 0 ? (
            pendingRequests.map(req => (
              <Card key={req.id} style={[styles.serviceCard, { borderColor: colors.primary + '20', borderWidth: 1 }]}>
                <View style={styles.requestContent}>
                  <View style={styles.reqMain}>
                    <Text style={[styles.categoryTitle, { color: colors.text }]}>{req.category_name}</Text>
                    <View style={styles.detailRow}>
                      <MapPin size={14} color={colors.textLight} />
                      <Text style={[styles.detailText, { color: colors.textLight, fontSize: 13 }]} numberOfLines={1}>{req.address}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Calendar size={14} color={colors.textLight} />
                      <Text style={[styles.detailText, { color: colors.textLight, fontSize: 12 }]}>
                        {new Date(req.scheduled_at).toLocaleDateString()} • {new Date(req.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.priceAction}>
                    <Text style={[styles.priceTag, { color: colors.primary }]}>${Number(req.total_price).toLocaleString()}</Text>
                    <Button
                      title="Tomar"
                      onPress={() => req.id && handleAccept(req.id)}
                      loading={acceptService.isPending}
                      style={styles.smallBtn}
                      textStyle={styles.smallBtnText}
                    />
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard} variant="outlined">
              <Briefcase size={32} color={colors.textMuted} strokeWidth={1} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>Buscando solicitudes cerca de ti</Text>
            </Card>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 0 : SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 2,
    fontWeight: '500',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  availabilityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  availInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: SPACING.md,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  availText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statInfo: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  mainContent: {
    paddingHorizontal: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl * 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  badge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  serviceCard: {
    marginBottom: SPACING.md,
    padding: 0,
    overflow: 'hidden',
    borderRadius: RADIUS.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  categoryInfo: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    height: 26,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBody: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  cardFooter: {
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xxl,
    gap: 12,
    borderStyle: 'dashed',
    borderRadius: RADIUS.xl,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  offlineCard: {
    padding: SPACING.xl,
    alignItems: 'center',
    borderRadius: RADIUS.xl,
  },
  offlineText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
  },
  requestContent: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: 16,
    alignItems: 'center',
  },
  reqMain: {
    flex: 1,
  },
  priceAction: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
  },
  priceTag: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  smallBtn: {
    minHeight: 38,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
  },
  smallBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewItem: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 0,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewCategory: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 11,
    fontWeight: '600',
  }
});
