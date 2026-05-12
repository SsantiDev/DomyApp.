import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { AddFavoritePrompt } from '../services/AddFavoritePrompt';
import { Button } from '../ui/NativeButton';
import { Card } from '../ui/NativeCard';

interface RatingSectionProps {
    isClient: boolean;
    canRate: boolean;
    serviceReview?: { rating: number; comment?: string } | null;
    serviceWorker?: number | null;
    serviceWorkerName?: string | null;
    onShowRatingModal: () => void;
    showFavoritePrompt: boolean;
    submittedRating: number;
    onDismissFavoritePrompt: () => void;
    colors: any;
    styles: any;
}

export const RatingSection = ({
    isClient,
    canRate,
    serviceReview,
    serviceWorker,
    serviceWorkerName,
    onShowRatingModal,
    showFavoritePrompt,
    submittedRating,
    onDismissFavoritePrompt,
    colors,
    styles,
}: RatingSectionProps) => (
    <>
        {canRate && (
            <View style={styles.actionsContainer}>
                <Button
                    title="Calificar Labor"
                    onPress={onShowRatingModal}
                    variant="outline"
                    icon={<Star size={20} color={colors.primary} />}
                />
            </View>
        )}

        {isClient && serviceReview && (
            <View style={[styles.actionsContainer, { marginBottom: 0 }]}
            >
                <Card variant="flat" style={[styles.infoCard, { borderTopWidth: 2, borderTopColor: colors.warning + '60' }]}
                >
                    <View style={styles.sectionHeader}>
                        <Star size={20} color={colors.warning} fill={colors.warning} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tu calificación</Text>
                    </View>
                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={24}
                                color={s <= serviceReview.rating ? colors.warning : colors.border}
                                fill={s <= serviceReview.rating ? colors.warning : 'transparent'}
                            />
                        ))}
                    </View>
                    {!!serviceReview.comment && (
                        <View style={[styles.reviewComment, { backgroundColor: colors.surface }]}
                        >
                            <Text style={[styles.commentText, { color: colors.textLight }]}
                            >
                                "{serviceReview.comment}"
                            </Text>
                        </View>
                    )}
                </Card>
                {showFavoritePrompt && serviceWorker && (
                    <AddFavoritePrompt
                        workerId={serviceWorker}
                        workerName={serviceWorkerName ?? 'la operaria'}
                        rating={submittedRating}
                        onDismiss={onDismissFavoritePrompt}
                    />
                )}
            </View>
        )}
    </>
);
