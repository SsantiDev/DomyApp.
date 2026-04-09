import React, { useMemo } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/NativeCard';
import { SPACING, RADIUS } from '../../constants/theme';
import { ServiceRequestModal } from '../services/ServiceRequestModal';
import { useClientDashboard } from '../../hooks/useClientDashboard';
import { useRateService } from '../../hooks/useServices';
import { getStyles } from './ClientDashboard.styles';
import { WorkerSearch } from './WorkerSearch';
import {
    Plus, Wrench, Zap, Home, Utensils, Sparkles,
    CheckCircle, User, ChevronRight, WashingMachine,
    Leaf, PawPrint, ArrowRight, Star, MessageCircle, Send
} from 'lucide-react-native';
import { ChatRoom } from '../chat/ChatRoom';

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
};

const CategoryIcon = ({ name, color, size = 22 }: { name: string; color: string; size?: number }) => {
    switch (name) {
        case 'sparkles':
        case 'broom': return <Sparkles color={color} size={size} />;
        case 'zap': return <Zap color={color} size={size} />;
        case 'home': return <Home color={color} size={size} />;
        case 'wrench': return <Wrench color={color} size={size} />;
        case 'utensils': return <Utensils color={color} size={size} />;
        case 'washing-machine': return <WashingMachine color={color} size={size} />;
        case 'leaf': return <Leaf color={color} size={size} />;
        case 'paw-print': return <PawPrint color={color} size={size} />;
        default: return <Sparkles color={color} size={size} />;
    }
};

const STATUS_STEPS = ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] as const;
const STATUS_LABELS = { PENDING: 'Buscando', ACCEPTED: 'Confirmado', IN_PROGRESS: 'En curso' };

export default function ClientDashboard() {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        isModalVisible,
        isLoading,
        activeRequest,
        completedRequests,
        categories,
        navigateToDetail,
        toggleModal
    } = useClientDashboard();
    
    const rateService = useRateService();
    // Add chat state
    const [showChat, setShowChat] = React.useState(false);

    // Rating State
    const [ratingService, setRatingService] = React.useState<any>(null);
    const [rating, setRating] = React.useState(0);
    const [comment, setComment] = React.useState('');

    React.useEffect(() => {
        // Find the first unrated completed service
        if (completedRequests && completedRequests.length > 0) {
            const unrated = completedRequests.find(req => !req.review);
            if (unrated && !ratingService) {
                setRatingService(unrated);
            }
        }
    }, [completedRequests]);

    const handleRateSubmit = async () => {
        if (!ratingService) return;
        if (rating === 0) {
            alert('Por favor selecciona una calificación.');
            return;
        }
        try {
            await rateService.mutateAsync({ id: ratingService.id, rating, comment });
            setRatingService(null);
            setRating(0);
            setComment('');
        } catch (err: any) {
            alert(err?.message || 'No se pudo enviar la calificación.');
        }
    };

    if (isLoading && !categories) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        );
    }

    const currentStep = activeRequest ? STATUS_STEPS.indexOf(activeRequest.status as typeof STATUS_STEPS[number]) : -1;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.subtitle}>¿Qué necesitas hoy?</Text>
                    </View>
                    <View style={styles.headerBadge}>
                        <Star size={13} color={colors.primary} />
                        <Text style={styles.headerBadgeText}>Domy</Text>
                    </View>
                </View>
            </View>

            {/* CTA Principal */}
            <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => toggleModal(true)}
                activeOpacity={0.85}
            >
                <View style={styles.ctaLeft}>
                    <View style={styles.ctaIconWrap}>
                        <Plus size={18} color={colors.primary} />
                    </View>
                    <View>
                        <Text style={styles.ctaTitle}>Solicitar servicio</Text>
                        <Text style={styles.ctaSubtitle}>Rápido, seguro y profesional</Text>
                    </View>
                </View>
                <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>

            {/* Servicio Activo */}
            {activeRequest && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Servicio activo</Text>
                    <View style={styles.statusCard}>
                        {/* Barra de progreso */}
                        <View style={styles.progressRow}>
                            {STATUS_STEPS.map((step, i) => (
                                <React.Fragment key={step}>
                                    <View style={[styles.progressDot, i <= currentStep && styles.progressDotActive]}>
                                        {i < currentStep && <CheckCircle size={10} color="#fff" />}
                                    </View>
                                    {i < STATUS_STEPS.length - 1 && (
                                        <View style={[styles.progressLine, i < currentStep && styles.progressLineActive]} />
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                        <View style={styles.progressLabels}>
                            {STATUS_STEPS.map((step, i) => (
                                <Text key={step} style={[styles.progressLabel, i === currentStep && styles.progressLabelActive]}>
                                    {STATUS_LABELS[step]}
                                </Text>
                            ))}
                        </View>

                        <View style={styles.statusDivider} />

                        <Text style={styles.activeServiceName}>{activeRequest.category_name}</Text>
                        <Text style={styles.addressText}>{activeRequest.address}</Text>

                        {activeRequest.worker && (
                            <View style={styles.workerRow}>
                                <View style={styles.avatarMini}>
                                    <User size={15} color="#fff" />
                                </View>
                                <Text style={styles.workerText}>
                                    {activeRequest.status === 'IN_PROGRESS' ? 'Tu operaria está trabajando' : 'Tu operaria está en camino'}
                                </Text>
                            </View>
                        )}

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border + '50' }}>
                            <TouchableOpacity 
                                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }} 
                                onPress={() => navigateToDetail(activeRequest.id)}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary, marginRight: 4 }}>Ver detalle</Text>
                                <ChevronRight size={16} color={colors.primary} />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, elevation: 2, shadowColor: colors.primary, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 6 }} 
                                onPress={() => setShowChat(true)}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff', marginRight: 6 }}>Mensajes</Text>
                                <MessageCircle size={18} color="#fff" />
                                {(activeRequest.unread_messages_count || 0) > 0 && (
                                    <View style={{ position: 'absolute', top: -6, right: -6, backgroundColor: colors.danger, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.surface }}>
                                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{activeRequest.unread_messages_count}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Chat Overlay */}
            {activeRequest && showChat && (
                <ChatRoom 
                    serviceId={activeRequest.id!} 
                    visible={showChat} 
                    onClose={() => setShowChat(false)} 
                    defaultTab="COORDINATION" 
                />
            )}

            {/* Búsqueda de operarias */}
            <WorkerSearch />

            {/* Categorías de servicio */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Servicios disponibles</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.carouselContainer}
                    contentContainerStyle={{ paddingRight: SPACING.lg }}
                >
                    {categories?.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.serviceCard}
                            onPress={() => toggleModal(true)}
                            activeOpacity={0.75}
                        >
                            <View style={styles.categoryIconWrap}>
                                <CategoryIcon name={cat.icon_name} color={colors.primary} size={24} />
                            </View>
                            <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
                            <Text style={styles.categoryPrice}>Desde ${Number(cat.base_price).toLocaleString()}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Banner Promocional */}
            <View style={styles.promoCard}>
                <View style={styles.promoContent}>
                    <View style={styles.promoTag}>
                        <Text style={styles.promoTagText}>Beneficio exclusivo</Text>
                    </View>
                    <Text style={styles.promoTitle}>15% en tu primer{'\n'}servicio</Text>
                    <Text style={styles.promoSubtitle}>Reserva hoy y ahorra en tu primera limpieza profunda.</Text>
                </View>
                <View style={styles.promoCircle1} />
                <View style={styles.promoCircle2} />
            </View>

            {/* Cómo funciona */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>
                <View style={styles.stepsCard}>
                    {[
                        { n: '1', title: 'Elige tu servicio', desc: 'Selecciona entre servicios especializados para tu hogar.' },
                        { n: '2', title: 'Danos los detalles', desc: 'Indica la dirección y el horario que prefieras.' },
                        { n: '3', title: '¡Listo!', desc: 'Una operaria verificada llegará a tu puerta.' },
                    ].map((step, i, arr) => (
                        <View key={step.n} style={[styles.stepItem, i < arr.length - 1 && styles.stepItemDivided]}>
                            <View style={styles.stepNumberWrap}>
                                <Text style={styles.stepNumberText}>{step.n}</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>{step.title}</Text>
                                <Text style={styles.stepDesc}>{step.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Historial reciente */}
            {completedRequests.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Últimas labores</Text>
                    {completedRequests.map((req) => (
                        <TouchableOpacity
                            key={req.id}
                            style={styles.historyItem}
                            onPress={() => navigateToDetail(req.id)}
                            activeOpacity={0.75}
                        >
                            <View style={styles.historyIcon}>
                                <CheckCircle size={18} color={colors.success} />
                            </View>
                            <View style={styles.historyInfo}>
                                <Text style={styles.historyCategory}>{req.category_name}</Text>
                                <Text style={styles.historyDate}>
                                    {new Date(req.scheduled_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </Text>
                            </View>
                            {!req.review && (
                                <View style={styles.rateTag}>
                                    <Star size={10} color={colors.warning} />
                                    <Text style={[styles.rateTagText, { color: colors.warning }]}>Calificar</Text>
                                </View>
                            )}
                            <ChevronRight size={16} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Rating Modal forced */}
            <Modal
                visible={!!ratingService}
                transparent={true}
                animationType="slide"
                onRequestClose={() => {}} // User MUST rate!
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: colors.surface, borderRadius: RADIUS.xl, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }}>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 8, textAlign: 'center' }}>¿Cómo fue tu experiencia?</Text>
                        <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
                            Acabas de finalizar el servicio de <Text style={{ fontWeight: 'bold' }}>{ratingService?.category_name}</Text>. Tu operaria espera tu valiosa calificación.
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                    <Star
                                        size={45}
                                        color={s <= rating ? colors.warning : colors.border}
                                        fill={s <= rating ? colors.warning : 'transparent'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={{ width: '100%', borderWidth: 1, borderColor: colors.border, borderRadius: RADIUS.lg, padding: 16, height: 100, textAlignVertical: 'top', fontSize: 15, color: colors.text, backgroundColor: colors.background, marginBottom: 24 }}
                            placeholder="Déjale un comentario a tu operaria (opcional)..."
                            placeholderTextColor={colors.textMuted}
                            multiline
                            numberOfLines={3}
                            value={comment}
                            onChangeText={setComment}
                        />

                        <TouchableOpacity
                            style={{ backgroundColor: colors.primary, padding: 16, borderRadius: RADIUS.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', opacity: rateService.isPending ? 0.7 : 1 }}
                            onPress={handleRateSubmit}
                            disabled={rateService.isPending}
                        >
                            {rateService.isPending ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Send size={20} color="#ffffff" style={{ marginRight: 8 }} />
                                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800' }}>Enviar Calificación</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ServiceRequestModal
                visible={isModalVisible}
                onClose={() => toggleModal(false)}
            />
        </ScrollView>
    );
}
