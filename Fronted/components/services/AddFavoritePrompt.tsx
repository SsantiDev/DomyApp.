import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS } from '../../constants/theme';
import { useAddFavorite, useFavorites } from '../../hooks/useFavorites';

interface Props {
    workerId: number;
    workerName: string;
    rating: number;
    onDismiss: () => void;
}

const FAVORITE_THRESHOLD = 4;

export const AddFavoritePrompt = ({ workerId, workerName, rating, onDismiss }: Props) => {
    const { colors } = useTheme();
    const { data: favorites } = useFavorites();
    const addFavorite = useAddFavorite();

    const alreadyFavorite = useMemo(
        () => favorites?.some(f => f.worker_id === workerId) ?? false,
        [favorites, workerId]
    );

    if (rating < FAVORITE_THRESHOLD || alreadyFavorite) return null;

    const handleAdd = async () => {
        await addFavorite.mutateAsync(workerId);
        onDismiss();
    };

    return (
        <View style={{
            backgroundColor: colors.surface,
            borderRadius: RADIUS.lg,
            padding: SPACING.md,
            borderWidth: 1,
            borderColor: colors.primary + '40',
            marginTop: SPACING.md,
        }}>
            <TouchableOpacity onPress={onDismiss} style={{ position: 'absolute', top: SPACING.xs, right: SPACING.xs, padding: 4, zIndex: 1 }}>
                <X size={14} color={colors.textLight} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs }}>
                <Heart size={18} color={colors.primary} fill={colors.primary + '40'} />
                <Text style={{ fontWeight: '700', color: colors.text, marginLeft: SPACING.xs, fontSize: 14 }}>
                    ¿Añadir a {workerName} a tus favoritas?
                </Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.textLight, marginBottom: SPACING.sm }}>
                La próxima vez que solicites un servicio, {workerName} tendrá prioridad.
            </Text>
            <TouchableOpacity
                onPress={handleAdd}
                disabled={addFavorite.isPending}
                style={{
                    backgroundColor: colors.primary,
                    padding: SPACING.sm,
                    borderRadius: RADIUS.md,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: colors.white, fontWeight: '700', fontSize: 13 }}>
                    {addFavorite.isPending ? 'Añadiendo...' : 'Sí, añadir a favoritas'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
