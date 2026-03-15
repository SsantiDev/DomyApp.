import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/NativeCard';
import { SPACING } from '../../constants/theme';

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
    const { colors } = useTheme();

    return (
        <Card style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Recuperar Contraseña</Text>
            <Text style={[styles.infoText, { color: colors.textMuted }]}>
                La recuperación de contraseña está en construcción.
            </Text>
            <View style={styles.footer}>
                <Pressable onPress={onBackToLogin}>
                    <Text style={[styles.linkText, { color: colors.primary }]}>Volver al Login</Text>
                </Pressable>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: 450,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    infoText: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 16,
    },
    footer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#edf2f7',
        width: '100%',
        alignItems: 'center',
    },
    linkText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
