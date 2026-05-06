import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Modal, Image, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './WorkerSearch.styles';
import { Search, MapPin, Star, User, Filter, CheckCircle, TrendingUp, ChevronUp, ChevronDown, X } from 'lucide-react-native';
import { useWorkers } from '../../hooks/useWorkers';
import { Worker } from '../../types/user';

const CITIES = ['Medellín', 'Envigado', 'Sabaneta', 'Bello'];
const RATING_FILTERS: { label: string; value: number | undefined }[] = [
    { label: 'Todas', value: undefined },
    { label: '4+', value: 4 },
    { label: '3+', value: 3 },
];

export const WorkerSearch = () => {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [minRating, setMinRating] = useState<number | undefined>(undefined);
    const [sortAsc, setSortAsc] = useState(false); // false = mayor a menor (default)
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: workerData, isLoading, isError } = useWorkers({
        search: debouncedSearch || undefined,
        city: selectedCity,
        is_available: onlyAvailable ? true : undefined,
        min_rating: minRating,
    });

    const rawWorkers = workerData?.results ?? [];
    const workers = [...rawWorkers].sort((a, b) =>
        sortAsc ? a.average_rating - b.average_rating : b.average_rating - a.average_rating
    );

    const toggleCity = (city: string) => {
        setSelectedCity(selectedCity === city ? undefined : city);
    };

    const cityChips = [
        { label: 'Solo Disponibles', key: 'available' },
        ...CITIES.map(c => ({ label: c, key: c }))
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Encuentra tu Operario/a</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Search size={18} color={colors.textMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre o dirección..."
                    placeholderTextColor={colors.textMuted}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            {/* City & Availability Filters */}
            <FlatList
                horizontal
                data={cityChips}
                keyExtractor={item => item.key}
                showsHorizontalScrollIndicator={false}
                style={styles.filtersRow}
                renderItem={({ item }) => {
                    const isActive = item.key === 'available' ? onlyAvailable : selectedCity === item.key;
                    return (
                        <TouchableOpacity
                            style={[styles.filterChip, isActive && styles.filterChipActive]}
                            onPress={() => item.key === 'available' ? setOnlyAvailable(!onlyAvailable) : toggleCity(item.label)}
                        >
                            <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />

            {/* Rating Filter Row */}
            <View style={styles.ratingFilterRow}>
                <View style={styles.ratingFilterLeft}>
                    <Star size={13} color={colors.warning} fill={colors.warning} />
                    <Text style={styles.ratingFilterLabel}>Calificación mínima:</Text>
                </View>
                <View style={styles.ratingFilterRight}>
                    {RATING_FILTERS.map((rf) => {
                        const isActive = minRating === rf.value;
                        return (
                            <TouchableOpacity
                                key={String(rf.value)}
                                style={[styles.filterChip, styles.filterChipSmall, isActive && styles.filterChipActive]}
                                onPress={() => setMinRating(rf.value)}
                            >
                                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                                    {rf.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}

                    {/* Sort Toggle */}
                    <TouchableOpacity
                        style={[styles.filterChip, styles.filterChipSmall, styles.sortToggle]}
                        onPress={() => setSortAsc(prev => !prev)}
                    >
                        {sortAsc ? <ChevronUp size={13} color={colors.primary} /> : <ChevronDown size={13} color={colors.primary} />}
                        <Text style={styles.sortToggleText}>
                            {sortAsc ? 'Menor' : 'Mayor'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Worker List - FlatList horizontal */}
            {isLoading ? (
                <View style={styles.loadingWorkers}>
                    <ActivityIndicator color={colors.primary} size="large" />
                </View>
            ) : isError ? (
                <View style={styles.noResults}>
                    <Text style={styles.errorText}>Error al cargar. Intenta de nuevo.</Text>
                </View>
            ) : workers.length > 0 ? (
                <FlatList
                    horizontal
                    data={workers}
                    keyExtractor={item => String(item.id)}
                    showsHorizontalScrollIndicator={false}
                    style={styles.workerFlatList}
                    contentContainerStyle={styles.workerList}
                    renderItem={({ item: worker }: { item: Worker }) => (
                        <TouchableOpacity
                            style={styles.workerCard}
                            onPress={() => setSelectedWorker(worker)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.workerHeader}>
                                <View style={styles.avatar}>
                                    {worker.profile_picture ? (
                                        <Image source={{ uri: worker.profile_picture }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                                    ) : (
                                        <User size={24} color={colors.primary} />
                                    )}
                                    {worker.is_available && <View style={styles.availableBadge} />}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.workerName} numberOfLines={1}>
                                        {worker.first_name} {worker.last_name}
                                    </Text>
                                    <View style={styles.cityContainer}>
                                        <MapPin size={12} color={colors.textMuted} />
                                        <Text style={styles.cityText}>{worker.city || 'No especificada'}</Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={styles.bioText} numberOfLines={2}>
                                {worker.bio || 'Sin descripción disponible.'}
                            </Text>

                            <View style={styles.workerFooter}>
                                <View style={styles.ratingContainer}>
                                    <Star size={12} color={colors.warning} fill={colors.warning} />
                                    <Text style={styles.ratingText}>{Number(worker.average_rating).toFixed(1)}</Text>
                                </View>
                                {worker.is_available && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <CheckCircle size={14} color={colors.success} />
                                        <Text style={{ fontSize: 11, color: colors.success, marginLeft: 4, fontWeight: '600' }}>Disponible</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <View style={styles.noResults}>
                    <Filter size={40} color={colors.textMuted} opacity={0.3} />
                    <Text style={styles.noResultsText}>No se encontraron operarios/as</Text>
                </View>
            )}

            {/* Worker Profile Detail Modal */}
            <Modal
                visible={selectedWorker !== null}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedWorker(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Perfil de la Operaria</Text>
                            <TouchableOpacity onPress={() => setSelectedWorker(null)} style={styles.closeButton}>
                                <X size={20} color={colors.textLight} />
                            </TouchableOpacity>
                        </View>

                        {selectedWorker && (
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalBody}>
                                {/* Hero Card: Photo, Name, City, Status */}
                                <View style={styles.profileHero}>
                                    <View style={styles.largeAvatar}>
                                        {selectedWorker.profile_picture ? (
                                            <Image source={{ uri: selectedWorker.profile_picture }} style={styles.largeAvatarImage} />
                                        ) : (
                                            <User size={48} color={colors.primary} />
                                        )}
                                        {selectedWorker.is_available && <View style={styles.modalAvailableBadge} />}
                                    </View>
                                    
                                    <Text style={styles.modalWorkerName}>
                                        {selectedWorker.first_name} {selectedWorker.last_name}
                                    </Text>
                                    
                                    <View style={styles.modalCityRow}>
                                        <MapPin size={14} color={colors.textLight} />
                                        <Text style={styles.modalCityText}>
                                            {selectedWorker.city || 'No especificada'}
                                        </Text>
                                    </View>

                                    {/* Availability Tag */}
                                    <View style={[
                                        styles.statusTag, 
                                        { backgroundColor: selectedWorker.is_available ? colors.success + '15' : colors.textMuted + '15' }
                                    ]}>
                                        <View style={[
                                            styles.statusTagDot, 
                                            { backgroundColor: selectedWorker.is_available ? colors.success : colors.textMuted }
                                        ]} />
                                        <Text style={[
                                            styles.statusTagText, 
                                            { color: selectedWorker.is_available ? colors.success : colors.textMuted }
                                        ]}>
                                            {selectedWorker.is_available ? 'Disponible Ahora' : 'No Disponible'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Rating Banner */}
                                <View style={styles.modalRatingRow}>
                                    <View style={styles.modalRatingBox}>
                                        <Star size={24} color={colors.warning} fill={colors.warning} />
                                        <Text style={styles.modalRatingValue}>
                                            {Number(selectedWorker.average_rating).toFixed(1)}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={styles.modalRatingTitle}>Calificación Promedio</Text>
                                        <Text style={styles.modalRatingSubtitle}>
                                            {selectedWorker.reviews && selectedWorker.reviews.length > 0 
                                                ? `Basado en ${selectedWorker.reviews.length} reseña${selectedWorker.reviews.length !== 1 ? 's' : ''}`
                                                : 'Aún sin calificaciones'
                                            }
                                        </Text>
                                    </View>
                                </View>

                                {/* Bio Section */}
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Sobre mí</Text>
                                    <Text style={styles.modalBioText}>
                                        {selectedWorker.bio || 'Esta operaria no ha agregado una descripción a su perfil todavía.'}
                                    </Text>
                                </View>

                                {/* Reviews Section */}
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Reseñas de Clientes</Text>
                                    {selectedWorker.reviews && selectedWorker.reviews.length > 0 ? (
                                        selectedWorker.reviews.map((review) => (
                                            <View key={review.id} style={styles.modalReviewCard}>
                                                <View style={styles.reviewHeaderRow}>
                                                    <Text style={styles.reviewerName}>{review.client_name}</Text>
                                                    <Text style={styles.reviewDateText}>
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </Text>
                                                </View>
                                                
                                                {/* Review Stars */}
                                                <View style={styles.reviewStarsRow}>
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star 
                                                            key={s} 
                                                            size={12} 
                                                            color={s <= review.rating ? colors.warning : colors.border} 
                                                            fill={s <= review.rating ? colors.warning : 'transparent'}
                                                        />
                                                    ))}
                                                </View>

                                                {review.comment ? (
                                                    <Text style={styles.reviewCommentText}>"{review.comment}"</Text>
                                                ) : (
                                                    <Text style={[styles.reviewCommentText, { fontStyle: 'italic', color: colors.textMuted }]}>
                                                        Sin comentario adicional.
                                                    </Text>
                                                )}
                                            </View>
                                        ))
                                    ) : (
                                        <View style={styles.emptyReviewsBox}>
                                            <Text style={styles.emptyReviewsText}>
                                                Esta operaria aún no cuenta con reseñas en el sistema. ¡Sé la primera persona en calificarla al completar un servicio!
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};
