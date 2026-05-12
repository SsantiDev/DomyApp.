import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Star, Send } from 'lucide-react-native';
import { Card } from '../ui/NativeCard';

interface RatingModalProps {
    visible: boolean;
    rating: number;
    comment: string;
    serviceCategoryName: string;
    onClose: () => void;
    onSetRating: (value: number) => void;
    onSetComment: (value: string) => void;
    onSubmit: () => void;
    colors: any;
    styles: any;
}

export const RatingModal = ({
    visible,
    rating,
    comment,
    serviceCategoryName,
    onClose,
    onSetRating,
    onSetComment,
    onSubmit,
    colors,
    styles,
}: RatingModalProps) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <Card style={[styles.ratingModal, { backgroundColor: colors.background }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>¿Cómo fue tu experiencia?</Text>
                <Text style={[styles.modalSubtitle, { color: colors.textLight }]}
                >
                    Califica el servicio de {serviceCategoryName} para ayudarnos a mejorar.
                </Text>

                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <TouchableOpacity key={s} onPress={() => onSetRating(s)}>
                            <Star
                                size={40}
                                color={s <= rating ? colors.warning : colors.border}
                                fill={s <= rating ? colors.warning : 'transparent'}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <TextInput
                    style={[styles.commentInput, {
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor: colors.surface
                    }]}
                    placeholder="Escribe un comentario opcional..."
                    placeholderTextColor={colors.textLight}
                    multiline
                    numberOfLines={4}
                    value={comment}
                    onChangeText={onSetComment}
                />

                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        style={[styles.cancelBtn, { borderColor: colors.border }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.cancelBtnText, { color: colors.textLight }]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                        onPress={onSubmit}
                    >
                        <Send size={20} color="#ffffff" />
                        <Text style={styles.submitBtnText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        </View>
    </Modal>
);
