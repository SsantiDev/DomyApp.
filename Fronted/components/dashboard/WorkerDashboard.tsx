import React, { useMemo } from 'react';
import { View, Text, Switch, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkerAvailability } from '../../hooks/useWorkerAvailability';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/NativeCard';
import { Button } from '../ui/NativeButton';
import { useServiceRequests, useAcceptService, useServiceNotifications, useRejectService } from '../../hooks/useServices';
import {
  Briefcase, Clock, MapPin, Wallet, Calendar,
  ChevronRight, Bell, Star, AlertCircle, ShieldCheck, MessageCircle
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { getStyles } from './WorkerDashboard.styles';
import { ChatRoom } from '../chat/ChatRoom';

export default function WorkerDashboard() {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { user } = useAuth();
  const router = useRouter();
  const { isAvailable, loading: loadingAvail, handleToggle } = useWorkerAvailability();
  const { data: requests, isLoading: loadingRequests } = useServiceRequests();
  const { data: notifications, isLoading: loadingNotifications } = useServiceNotifications();
  const acceptService = useAcceptService();
  const rejectService = useRejectService();

  const [rejectModalVisible, setRejectModalVisible] = React.useState(false);
  const [selectedRequestId, setSelectedRequestId] = React.useState<number | null>(null);
  const [rejectReason, setRejectReason] = React.useState('');
  const [activeChatId, setActiveChatId] = React.useState<number | null>(null);

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
    } catch (error: any) {
      const message = error?.response?.data?.error || 'No se pudo aceptar el servicio.';
      const isVerificationError = error?.response?.status === 403 && message.includes('verificación');
      Alert.alert(
        isVerificationError ? 'Perfil no verificado' : 'Servicio no disponible',
        message,
        isVerificationError
          ? [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Verificar ahora', onPress: () => router.push('/verification') },
            ]
          : [{ text: 'OK' }]
      );
    }
  };

  const handleReject = async () => {
    if (!selectedRequestId) return;
    if (!rejectReason.trim()) {
      Alert.alert('Requerido', 'Por favor ingresa un motivo para rechazar el servicio.');
      return;
    }

    try {
      await rejectService.mutateAsync({ id: selectedRequestId, reason: rejectReason });
      setRejectModalVisible(false);
      setRejectReason('');
      setSelectedRequestId(null);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'No se pudo rechazar el servicio.');
    }
  };

  const incomingRequests = useMemo(() =>
    notifications?.filter(n => n.status === 'PENDING') || [],
    [notifications]);

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

  const averageRating = user?.worker_info?.average_rating || 0;

  if (loadingRequests || loadingNotifications) {
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
        {user?.verification?.status !== 'APPROVED' && (
          <TouchableOpacity
            onPress={() => router.push('/verification')}
            activeOpacity={0.8}
            style={{ marginBottom: 16 }}
          >
            <Card variant="flat" style={{
              backgroundColor: user?.verification?.status === 'PENDING' ? colors.primary + '10' :
                user?.verification?.status === 'REJECTED' ? colors.danger + '10' :
                  colors.warning + '10',
              borderColor: user?.verification?.status === 'PENDING' ? colors.primary + '40' :
                user?.verification?.status === 'REJECTED' ? colors.danger + '40' :
                  colors.warning + '40',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              gap: 12,
            }}>
              {user?.verification?.status === 'PENDING' ? (
                <Clock size={24} color={colors.primary} />
              ) : user?.verification?.status === 'REJECTED' ? (
                <AlertCircle size={24} color={colors.danger} />
              ) : (
                <ShieldCheck size={24} color={colors.warning} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontWeight: '800',
                  fontSize: 14,
                  color: user?.verification?.status === 'PENDING' ? colors.primary :
                    user?.verification?.status === 'REJECTED' ? colors.danger :
                      colors.warning
                }}>
                  {user?.verification?.status === 'PENDING' ? 'Perfil en revisión' :
                    user?.verification?.status === 'REJECTED' ? 'Verificación rechazada' :
                      'Verifica tu identidad'}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
                  {user?.verification?.status === 'PENDING' ? 'Estamos validando tus documentos.' :
                    user?.verification?.status === 'REJECTED' ? (user?.verification?.rejection_reason || 'Tus documentos no fueron aprobados.') :
                      'Necesario para aceptar servicios y recibir pagos.'}
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textLight} />
            </Card>
          </TouchableOpacity>
        )}

        <Card variant="flat" style={[
          styles.availabilityCard,
          isAvailable && styles.availabilityCardOnline,
        ]}>
          <View style={styles.availInfo}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: isAvailable ? colors.success : colors.textMuted }
            ]} />
            <Text style={[
              styles.availText,
              { color: isAvailable ? colors.success : colors.textMuted }
            ]}>
              Estas {isAvailable ? 'en línea para recibir' : 'fuera de linea, activa para ver'} solicitudes
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={onToggle}
            disabled={loadingAvail}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={colors.white}
          />
        </Card>
      </View>

      {/* Stats Section */}
      <View style={styles.statsRow}>
        {/* Hero: Ganancias */}
        <Card style={[styles.statCard, styles.statCardHero, styles.statCardEarnings]} variant="flat">
          <View style={styles.statHeroLeft}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
              <Wallet size={22} color={colors.primary} />
            </View>
            <View style={{ marginTop: 8 }}>
              <Text style={styles.statHeroLabel}>Ganancias Totales</Text>
              <Text style={styles.statHeroSub}>Total acumulado</Text>
            </View>
          </View>
          <Text style={styles.statHeroValue}>${totalEarnings.toLocaleString()}</Text>
        </Card>

        {/* Secondary row: Rating + Labores */}
        <View style={styles.statsSecondaryRow}>
          <Card style={[styles.statCard, styles.statCardSecondary, styles.statCardRating]} variant="flat">
            <View style={[styles.statIcon, { backgroundColor: colors.success + '15' }]}>
              <Star size={22} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{averageRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </Card>
          <Card style={[styles.statCard, styles.statCardSecondary, styles.statCardJobs]} variant="flat">
            <View style={[styles.statIcon, { backgroundColor: colors.warning + '15' }]}>
              <Briefcase size={22} color={colors.warning} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{completedCount}</Text>
            <Text style={styles.statLabel}>Labores</Text>
          </Card>
        </View>
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
            activeRequests.map(req => {
              const isInProgress = req.status === 'IN_PROGRESS';
              const accentColor = isInProgress ? colors.warning : colors.success;
              return (
              <Card variant="flat" key={req.id} style={[styles.serviceCard, { borderLeftWidth: 3, borderLeftColor: accentColor }]}>
                {/* HEADER */}
                <View style={styles.cardHeader}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryTitle}>{req.category_name}</Text>
                    <View style={styles.row}>
                      <Calendar size={12} color={colors.textLight} />
                      <Text style={styles.timeText}>
                        {new Date(req.scheduled_at).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                      </Text>
                      <Text style={[styles.timeText, { color: colors.textMuted }]}> · </Text>
                      <Clock size={12} color={colors.textLight} />
                      <Text style={styles.timeText}>
                        {new Date(req.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: accentColor + '18' }]}>
                    <View style={[styles.statusDot, { backgroundColor: accentColor }]} />
                    <Text style={[styles.statusText, { color: accentColor }]}>
                      {isInProgress ? 'En Labor' : 'Asignado'}
                    </Text>
                  </View>
                </View>

                {/* MAIN */}
                <View style={styles.cardBody}>
                  <View style={styles.detailRow}>
                    <MapPin size={14} color={colors.textLight} />
                    <Text style={styles.detailText} numberOfLines={2}>{req.address}</Text>
                  </View>
                  {req.total_price && (
                    <View style={styles.detailRow}>
                      <Wallet size={14} color={colors.textLight} />
                      <Text style={[styles.detailText, { color: colors.primary, fontWeight: '700' }]}>
                        ${Number(req.total_price).toLocaleString()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* FOOTER */}
                <View style={styles.activeCardFooter}>
                  <TouchableOpacity
                    style={styles.footerDetailBtn}
                    onPress={() => router.push(`/service-detail/${req.id}`)}
                    activeOpacity={0.7}
                  >
                    <ChevronRight size={14} color={colors.primary} />
                    <Text style={styles.footerDetailText}>Ver detalle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.footerChatBtn}
                    onPress={() => setActiveChatId(req.id!)}
                    activeOpacity={0.8}
                  >
                    <MessageCircle size={14} color="#fff" />
                    <Text style={styles.footerChatText}>Chat</Text>
                    {(req.unread_messages_count || 0) > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{req.unread_messages_count}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </Card>
              );
            })
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
          ) : incomingRequests.length > 0 ? (
            incomingRequests.map(notification => {
              const req = notification.service_request_details;
              return (
              <Card variant="flat" key={notification.id} style={styles.serviceCard}>
                <View style={styles.requestContent}>
                  <View style={styles.requestTopRow}>
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
                    <Text style={styles.priceTag}>${Number(req.total_price).toLocaleString()}</Text>
                  </View>
                  <View style={styles.requestActions}>
                    <Button
                      title="Rechazar"
                      variant="outline"
                      onPress={() => {
                        setSelectedRequestId(req.id!);
                        setRejectModalVisible(true);
                      }}
                      style={[styles.actionBtn, { borderColor: colors.danger }]}
                      textStyle={{ color: colors.danger }}
                    />
                    <Button
                      title="Tomar"
                      onPress={() => req.id && handleAccept(req.id)}
                      loading={acceptService.isPending}
                      style={styles.actionBtn}
                    />
                  </View>
                </View>
              </Card>
              );
            })
          ) : (
            <Card style={styles.emptyCard} variant="outlined">
              <Briefcase size={32} color={colors.textMuted} strokeWidth={1} />
              {(!user?.worker_info?.categories || user.worker_info.categories.length === 0) ? (
                <>
                  <Text style={styles.emptyText}>Sin categorías configuradas</Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                    <Text style={[styles.emptyText, { color: colors.primary, fontSize: 13, marginTop: 4 }]}>
                      Ir al perfil y seleccionar los servicios que ofreces →
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.emptyText}>Buscando solicitudes cerca de ti</Text>
              )}
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

      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.surface, padding: 24, borderRadius: 16, width: '100%', maxWidth: 400 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Rechazar Servicio</Text>
              <TouchableOpacity onPress={() => setRejectModalVisible(false)}>
                <AlertCircle size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 14, color: colors.textLight, marginBottom: 16 }}>
              Por favor indica el motivo por el cual no puedes tomar este servicio.
            </Text>
            <TextInput
              style={{ 
                backgroundColor: colors.background, 
                borderRadius: 8, 
                padding: 12, 
                color: colors.text, 
                minHeight: 100, 
                textAlignVertical: 'top',
                marginBottom: 20,
                borderWidth: 1,
                borderColor: colors.border
              }}
              placeholder="Ej: No estoy disponible a esa hora"
              placeholderTextColor={colors.textMuted}
              multiline
              value={rejectReason}
              onChangeText={setRejectReason}
            />
            <Button 
              title="Confirmar Rechazo" 
              onPress={handleReject} 
              loading={rejectService.isPending}
              style={{ backgroundColor: colors.danger, width: '100%' }} 
            />
          </View>
        </View>
      </Modal>

      {/* Chat Overlay */}
      {activeChatId && (
          <ChatRoom 
              serviceId={activeChatId} 
              visible={!!activeChatId} 
              onClose={() => setActiveChatId(null)} 
              defaultTab="COORDINATION" 
          />
      )}
    </ScrollView>
  );
}

