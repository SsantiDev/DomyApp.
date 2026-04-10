import React, { useMemo } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING } from '../../constants/theme';
import { ServiceRequestModal } from '../services/ServiceRequestModal';
import { useClientDashboard } from '../../hooks/useClientDashboard';
import { getStyles } from './ClientDashboard.styles';
import { WorkerSearch } from './WorkerSearch';
import { ActiveServiceCard } from './ActiveServiceCard';
import {
    Plus, Wrench, Zap, Home, Utensils, Sparkles,
    CheckCircle, WashingMachine,
    Leaf, PawPrint, ArrowRight, Star, ChevronRight
} from 'lucide-react-native';

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

    if (isLoading && !categories) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        );
    }

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
                    <ActiveServiceCard
                        activeRequest={activeRequest}
                        onNavigate={navigateToDetail}
                    />
                </View>
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
                            activeOpacity={0.82}
                        >
                            {/* Header */}
                            <View style={styles.cardHeader}>
                                <View style={styles.cardHeaderCircle1} />
                                <View style={styles.cardHeaderCircle2} />
                            </View>

                            {/* Floating badge */}
                            <View style={styles.cardBadge}>
                                <CategoryIcon name={cat.icon_name} color={colors.primary} size={22} />
                            </View>

                            {/* Main */}
                            <View style={styles.cardMain}>
                                <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
                            </View>

                            {/* Footer */}
                            <View style={styles.cardFooter}>
                                <Text style={styles.categoryPrice}>Desde ${Number(cat.base_price).toLocaleString()}</Text>
                                <ChevronRight size={13} color={colors.primary} />
                            </View>
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

            <ServiceRequestModal
                visible={isModalVisible}
                onClose={() => toggleModal(false)}
            />
        </ScrollView>
    );
}
