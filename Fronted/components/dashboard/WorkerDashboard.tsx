import React, { useMemo } from 'react';
import { View, Text, Switch, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkerAvailability } from '../../hooks/useWorkerAvailability';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/NativeCard';
import { Button } from '../ui/NativeButton';
import { useServiceRequests, useAcceptService } from '../../hooks/useServices';
import {
  Briefcase, Clock, MapPin, Wallet, Calendar,
  ChevronRight, Bell, Star, AlertCircle, ShieldCheck
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { getStyles } from './WorkerDashboard.styles';

export default function WorkerDashboard() {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
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
    if (user?.profile?.verification_status !== 'APPROVED') {
      Alert.alert(
        'Perfil no verificado',
        'Debes completar la verificación de tu identidad para poder aceptar servicios.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Verificar ahora', onPress: () => router.push('/verification') }
        ]
      );
      return;
    }

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
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Panel de Trabajo</Text>
            <Text style={styles.subtitle}>
              {activeRequests.length > 0
                ? `Hoy tienes ${activeRequests.length} labores activas`
                : 'No tienes labores para hoy'}
            </Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Verification Banner */}
        {user?.profile?.verification_status !== 'APPROVED' && (
          <TouchableOpacity
            onPress={() => router.push('/verification')}
            activeOpacity={0.8}
            style={{ marginBottom: 16 }}
          >
            <Card variant="flat" style={{
              backgroundColor: user?.profile?.verification_status === 'PENDING' ? colors.primary + '10' :
                user?.profile?.verification_status === 'REJECTED' ? colors.danger + '10' :
                  colors.warning + '10',
              borderColor: user?.profile?.verification_status === 'PENDING' ? colors.primary + '40' :
                user?.profile?.verification_status === 'REJECTED' ? colors.danger + '40' :
                  colors.warning + '40',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              gap: 12,
            }}>
              {user?.profile?.verification_status === 'PENDING' ? (
                <Clock size={24} color={colors.primary} />
              ) : user?.profile?.verification_status === 'REJECTED' ? (
                <AlertCircle size={24} color={colors.danger} />
              ) : (
                <ShieldCheck size={24} color={colors.warning} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontWeight: '800',
                  fontSize: 14,
                  color: user?.profile?.verification_status === 'PENDING' ? colors.primary :
                    user?.profile?.verification_status === 'REJECTED' ? colors.danger :
                      colors.warning
                }}>
                  {user?.profile?.verification_status === 'PENDING' ? 'Perfil en revisión' :
                    user?.profile?.verification_status === 'REJECTED' ? 'Verificación rechazada' :
                      'Verifica tu identidad'}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
                  {user?.profile?.verification_status === 'PENDING' ? 'Estamos validando tus documentos.' :
                    user?.profile?.verification_status === 'REJECTED' ? (user?.profile?.rejection_reason || 'Tus documentos no fueron aprobados.') :
                      'Necesario para aceptar servicios y recibir pagos.'}
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textLight} />
            </Card>
          </TouchableOpacity>
        )}

        <Card variant="flat" style={[
          styles.availabilityCard,
          { backgroundColor: isAvailable ? colors.primary : colors.surface }
        ]}>
          <View style={styles.availInfo}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: isAvailable ? '#4ADE80' : colors.textMuted }
            ]} />
            <Text style={[
              styles.availText,
              { color: isAvailable ? colors.white : colors.text }
            ]}>
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
            <Text style={styles.statLabel}>Ganancias</Text>
            <Text style={styles.statValue}>${totalEarnings.toLocaleString()}</Text>
          </View>
        </Card>
        <Card style={styles.statCard} variant="flat">
          <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
            <Star size={20} color={colors.success} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Rating</Text>
            <Text style={styles.statValue}>{averageRating.toFixed(1)}</Text>
          </View>
        </Card>
        <Card style={styles.statCard} variant="flat">
          <View style={[styles.statIcon, { backgroundColor: colors.warning + '15' }]}>
            <Briefcase size={20} color={colors.warning} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Labores</Text>
            <Text style={styles.statValue}>{completedCount}</Text>
          </View>
        </Card>
      </View>

      {/* Dynamic Sections */}
      <View style={styles.mainContent}>
        {/* Active Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Labores Activas</Text>
            {activeRequests.length > 0 && (
              <Text style={[styles.badge, { backgroundColor: colors.primary + '15', color: colors.primary }]}>
                {activeRequests.length}
              </Text>
            )}
          </View>

          {activeRequests.length > 0 ? (
            activeRequests.map(req => (
              <Card variant="flat" key={req.id} style={styles.serviceCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryTitle}>{req.category_name}</Text>
                    <View style={styles.row}>
                      <Clock size={12} color={colors.textLight} />
                      <Text style={styles.timeText}>
                        {new Date(req.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: req.status === 'IN_PROGRESS' ? colors.warning + '15' : colors.success + '15' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: req.status === 'IN_PROGRESS' ? colors.warning : colors.success }
                    ]}>
                      {req.status === 'IN_PROGRESS' ? 'En Labor' : 'Asignado'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.detailRow}>
                    <MapPin size={14} color={colors.textLight} />
                    <Text style={styles.detailText}>{req.address}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.cardFooter}
                  onPress={() => router.push(`/service-detail/${req.id}`)}
                >
                  <Text style={styles.footerLink}>Ver detalles y mapa</Text>
                  <ChevronRight size={16} color={colors.primary} />
                </TouchableOpacity>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard} variant="outlined">
              <Clock size={32} color={colors.textMuted} strokeWidth={1} />
              <Text style={styles.emptyText}>No tienes servicios próximos</Text>
            </Card>
          )}
        </View>

        {/* Available Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Servicios Disponibles</Text>
          </View>

          {!isAvailable ? (
            <Card style={styles.offlineCard}>
              <Text style={styles.offlineText}>Active su perfil para ver las solicitudes de hoy</Text>
            </Card>
          ) : pendingRequests.length > 0 ? (
            pendingRequests.map(req => (
              <Card variant="flat" key={req.id} style={styles.serviceCard}>
                <View style={styles.requestContent}>
                  <View style={styles.reqMain}>
                    <Text style={styles.categoryTitle}>{req.category_name}</Text>
                    <View style={styles.detailRow}>
                      <MapPin size={14} color={colors.textLight} />
                      <Text style={[styles.detailText, { color: colors.textLight, fontSize: 13 }]} numberOfLines={1}>
                        {req.address}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Calendar size={14} color={colors.textLight} />
                      <Text style={[styles.detailText, { color: colors.textLight, fontSize: 12 }]}>
                        {new Date(req.scheduled_at).toLocaleDateString()} • {new Date(req.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.priceAction}>
                    <Text style={styles.priceTag}>${Number(req.total_price).toLocaleString()}</Text>
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
              <Text style={styles.emptyText}>Buscando solicitudes cerca de ti</Text>
            </Card>
          )}
        </View>

        {/* Recent Reviews */}
        {completedWithReviews.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reseñas Recientes</Text>
              <Text style={[styles.badge, { backgroundColor: colors.warning + '15', color: colors.warning }]}>
                {completedWithReviews.length}
              </Text>
            </View>
            {completedWithReviews.map(req => (
              <TouchableOpacity
                key={req.id}
                onPress={() => router.push(`/service-detail/${req.id}`)}
              >
                <Card variant="flat" style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewCategory}>{req.category_name}</Text>
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
                    <Text style={styles.reviewText} numberOfLines={2}>
                      "{req.review.comment}"
                    </Text>
                  )}
                  <Text style={styles.reviewDate}>
                    {new Date(req.completed_at || req.scheduled_at).toLocaleDateString()}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

