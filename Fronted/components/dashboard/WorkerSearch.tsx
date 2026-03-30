import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './WorkerSearch.styles';
import { Search, MapPin, Star, User, Filter, CheckCircle, TrendingUp } from 'lucide-react-native';
import { useWorkers } from '../../hooks/useWorkers';
import { Worker } from '../../types/user';

const CITIES = ['Medellín', 'Envigado', 'Sabaneta', 'Bello'];
const RATING_FILTERS: { label: string; value: number | undefined }[] = [
    { label: 'Todas', value: undefined },
    { label: '4+ ★', value: 4 },
    { label: '3+ ★', value: 3 },
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 6 }}>
                <TrendingUp size={14} color={colors.textMuted} />
                <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '600', marginRight: 2 }}>Calificación mínima:</Text>
                {RATING_FILTERS.map((rf) => {
                    const isActive = minRating === rf.value;
                    return (
                        <TouchableOpacity
                            key={String(rf.value)}
                            style={[
                                styles.filterChip,
                                isActive && styles.filterChipActive,
                                { paddingVertical: 4, paddingHorizontal: 10 }
                            ]}
                            onPress={() => setMinRating(rf.value)}
                        >
                            <Text style={[styles.filterText, isActive && styles.filterTextActive, { fontSize: 12 }]}>
                                {rf.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                {/* Sort Toggle */}
                <TouchableOpacity
                    style={[styles.filterChip, { paddingVertical: 4, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 4 }]}
                    onPress={() => setSortAsc(prev => !prev)}
                >
                    <Star size={11} color={colors.primary} fill={colors.primary} />
                    <Text style={[styles.filterText, { fontSize: 12, color: colors.primary, fontWeight: '700' }]}>
                        {sortAsc ? 'Menor → Mayor' : 'Mayor → Menor'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Worker List - FlatList horizontal */}
            {isLoading ? (
                <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color={colors.primary} size="large" />
                </View>
            ) : isError ? (
                <View style={styles.noResults}>
                    <Text style={{ color: colors.danger as string, fontSize: 13 }}>Error al cargar. Intenta de nuevo.</Text>
                </View>
            ) : workers.length > 0 ? (
                <FlatList
                    horizontal
                    data={workers}
                    keyExtractor={item => String(item.id)}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 16 }}
                    renderItem={({ item: worker }: { item: Worker }) => (
                        <View style={styles.workerCard}>
                            <View style={styles.workerHeader}>
                                <View style={styles.avatar}>
                                    <User size={24} color={colors.primary} />
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
                        </View>
                    )}
                />
            ) : (
                <View style={styles.noResults}>
                    <Filter size={40} color={colors.textMuted} opacity={0.3} />
                    <Text style={styles.noResultsText}>No se encontraron operarios/as</Text>
                </View>
            )}
        </View>
    );
};
