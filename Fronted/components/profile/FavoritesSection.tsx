import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { Heart, Star, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS } from '../../constants/theme';
import { useFavorites, useRemoveFavorite } from '../../hooks/useFavorites';

export const FavoritesSection = () => {
    const { colors } = useTheme();
    const { data: favorites, isLoading } = useFavorites();
    const removeFavorite = useRemoveFavorite();

    const containerStyle = useMemo(() => ({
        marginTop: SPACING.lg,
        paddingHorizontal: SPACING.md,
    }), [SPACING]);

    const handleRemove = (id: number, name: string) => {
        Alert.alert(
            'Quitar favorita',
            `¿Quitar a ${name} de tus favoritas?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Quitar', style: 'destructive', onPress: () => removeFavorite.mutate(id) },
            ]
        );
    };

    if (isLoading) return null;

    return (
        <View style={containerStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm }}>
                <Heart size={18} color={colors.primary} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginLeft: SPACING.xs }}>
                    Mis Favoritas
                </Text>
            </View>

            {!favorites || favorites.length === 0 ? (
                <View style={{
                    padding: SPACING.lg,
                    borderRadius: RADIUS.lg,
                    backgroundColor: colors.surface,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderStyle: 'dashed',
                }}>
                    <Text style={{ color: colors.textLight, fontSize: 13, textAlign: 'center' }}>
                        Aún no tienes operarias favoritas.{'\n'}Después de calificar un servicio puedes añadirlas aquí.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => String(item.id)}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: SPACING.sm,
                            borderRadius: RADIUS.md,
                            backgroundColor: colors.surface,
                            borderWidth: 1,
                            borderColor: colors.border,
                            marginBottom: SPACING.xs,
                        }}>
                            {item.avatar_url ? (
                                <Image
                                    source={{ uri: item.avatar_url }}
                                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: SPACING.sm }}
                                />
                            ) : (
                                <View style={{
                                    width: 40, height: 40, borderRadius: 20,
                                    backgroundColor: colors.primary + '20',
                                    alignItems: 'center', justifyContent: 'center',
                                    marginRight: SPACING.sm,
                                }}>
                                    <Text style={{ fontWeight: '700', color: colors.primary, fontSize: 16 }}>
                                        {item.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: '600', color: colors.text, fontSize: 14 }}>{item.name}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                    <Star size={12} color={colors.warning} fill={colors.warning} />
                                    <Text style={{ fontSize: 12, color: colors.textLight, marginLeft: 3 }}>
                                        {item.avg_rating.toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleRemove(item.id, item.name)} style={{ padding: 6 }}>
                                <Trash2 size={16} color={colors.danger} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};
