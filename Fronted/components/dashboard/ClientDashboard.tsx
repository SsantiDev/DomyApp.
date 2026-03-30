import React, { useMemo } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { UserMenu } from '../ui/UserMenu';
import { Button } from '../ui/NativeButton';
import { Card } from '../ui/NativeCard';
import { SPACING } from '../../constants/theme';
import { ServiceRequestModal } from '../services/ServiceRequestModal';
import { useClientDashboard } from '../../hooks/useClientDashboard';
import { getStyles } from './ClientDashboard.styles';
import { WorkerSearch } from './WorkerSearch';
import { Plus, Wrench, Zap, Home, Utensils, Sparkles, History, ShieldCheck, Clock, CheckCircle, User, ChevronRight } from 'lucide-react-native';

const CategoryIcon = ({ name, color, size = 22 }: { name: string; color: string; size?: number }) => {
    switch (name) {
        case 'broom': return <Sparkles color={color} size={size} />;
        case 'zap': return <Zap color={color} size={size} />;
        case 'home': return <Home color={color} size={size} />;
        case 'wrench': return <Wrench color={color} size={size} />;
        case 'utensils': return <Utensils color={color} size={size} />;
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
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.greetingHeader}>
                    <Text style={styles.greeting}>¡Hola!</Text>
                    <Text style={styles.subtitle}>¿En qué podemos ayudarte hoy?</Text>
                </View>
            </View>

            {/* Main Action Bar (Integrated Button) */}
            <TouchableOpacity
                style={styles.actionBar}
                onPress={() => toggleModal(true)}
                activeOpacity={0.7}
            >
                <Plus size={20} color={colors.primary} />
                <Text style={styles.actionBarText}>Solicitar nuevo servicio...</Text>
                <View style={styles.actionBarIcon}>
                    <ChevronRight size={18} color="#FFF" />
                </View>
            </TouchableOpacity>

            {/* Active Request Alert (if any) */}
            {activeRequest && (
                <View style={{ marginBottom: SPACING.xl }}>
                    <Text style={styles.sectionTitle}>Servicio en curso</Text>
                    <Card style={styles.statusCard}>
                        <View style={styles.statusHeader}>
                            <View style={styles.statusInfo}>
                                <Clock size={16} color={colors.primary} />
                                <Text style={styles.statusTitle}>
                                    {activeRequest.status === 'PENDING' ? 'Buscando Operaria' :
                                        activeRequest.status === 'ACCEPTED' ? 'Servicio Confirmado' : 'Labor en Proceso'}
                                </Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: activeRequest.status === 'PENDING' ? colors.warning + '20' : colors.success + '20' }]}>
                                <Text style={[styles.badgeText, { color: activeRequest.status === 'PENDING' ? colors.warning : colors.success }]}>
                                    {activeRequest.status === 'PENDING' ? 'Pendiente' :
                                        activeRequest.status === 'ACCEPTED' ? 'Asignado' : 'En Labor'}
                                </Text>
                            </View>
                        </View>

                        <View>
                            <Text style={styles.activeServiceName}>{activeRequest.category_name}</Text>
                            <Text style={styles.addressText}>{activeRequest.address}</Text>

                            {activeRequest.worker && (
                                <View style={styles.workerInfo}>
                                    <View style={styles.avatarMini}>
                                        <User size={18} color="#FFF" />
                                    </View>
                                    <Text style={styles.workerText}>
                                        {activeRequest.status === 'IN_PROGRESS' ? 'Tu operaria está trabajando' : 'Tu operaria está en camino'}
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.detailLink}
                                onPress={() => navigateToDetail(activeRequest.id)}
                            >
                                <Text style={styles.detailLinkText}>Seguir mi servicio</Text>
                                <ChevronRight size={16} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>
            )}

            {/* Worker Search & Filtering */}
            <WorkerSearch />

            {/* Services Carousel */}
            <View>
                <Text style={styles.sectionTitle}>Servicios Disponibles</Text>
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
                        >
                            <View style={styles.categoryIcon}>
                                <CategoryIcon name={cat.icon_name} color={colors.primary} />
                            </View>
                            <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                            <Text style={styles.categoryPrice}>Desde ${Number(cat.base_price).toLocaleString()}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Subtle Promo Banner */}
            <View style={styles.promoCard}>
                <View style={styles.promoTag}>
                    <Text style={styles.promoTagText}>Beneficio Exclusivo</Text>
                </View>
                <Text style={styles.promoTitle}>¡Tu hogar en buenas manos!</Text>
                <Text style={styles.promoSubtitle}>Ahorra un 15% en tu primer servicio de limpieza profunda.</Text>
            </View>

            {/* How it Works Section */}
            <Text style={styles.sectionTitle}>¿Cómo funciona Domy?</Text>
            <View style={styles.stepsSection}>
                <View style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Elige tu servicio</Text>
                        <Text style={styles.stepDesc}>Selecciona entre variedad de servicios especializados.</Text>
                    </View>
                </View>
                <View style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Danos los detalles</Text>
                        <Text style={styles.stepDesc}>Indica la dirección y el horario que mejor te convenga.</Text>
                    </View>
                </View>
                <View style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>¡Y listo!</Text>
                        <Text style={styles.stepDesc}>Una operaria profesional y verificada llegará a tu hogar.</Text>
                    </View>
                </View>
            </View>

            {/* Recent History */}
            {completedRequests.length > 0 && (
                <View style={{ marginTop: SPACING.xl }}>
                    <Text style={styles.sectionTitle}>Últimas labores</Text>
                    {completedRequests.map((req) => (
                        <TouchableOpacity
                            key={req.id}
                            style={styles.historyItem}
                            onPress={() => navigateToDetail(req.id)}
                        >
                            <View style={styles.historyIcon}>
                                <CheckCircle size={20} color={colors.success} />
                            </View>
                            <View style={styles.historyInfo}>
                                <Text style={styles.historyCategory}>{req.category_name}</Text>
                                <Text style={styles.historyDate}>
                                    {new Date(req.scheduled_at).toLocaleDateString()}
                                </Text>
                            </View>
                            {!req.review && (
                                <View style={[styles.rateTag, { backgroundColor: colors.warning + '15' }]}>
                                    <Text style={[styles.rateTagText, { color: colors.warning }]}>Calificar</Text>
                                </View>
                            )}
                            <ChevronRight size={18} color={colors.textMuted} />
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

