import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/NativeCard';
import { Button } from '../ui/NativeButton';
import { NativeInput } from '../ui/NativeInput';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';

interface LoginFormProps {
    data: any;
    setData: (data: any) => void;
    onSubmit: () => void;
    loading: boolean;
    onSwitchToRegister: () => void;
    onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    data,
    setData,
    onSubmit,
    loading,
    onSwitchToRegister,
    onForgotPassword,
}) => {
    const { colors } = useTheme();

    return (
        <Card style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Login</Text>
            <View style={styles.formGroup}>
                <NativeInput
                    label="Correo Electrónico"
                    placeholder="ejemplo@correo.com"
                    value={data.email}
                    onChangeText={(val) => setData({ ...data, email: val })}
                    editable={!loading}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <NativeInput
                    label="Contraseña"
                    placeholder="********"
                    value={data.password}
                    onChangeText={(val) => setData({ ...data, password: val })}
                    editable={!loading}
                    secureTextEntry
                />
                <Button
                    title="Iniciar Sesión"
                    onPress={onSubmit}
                    loading={loading}
                    style={styles.submitBtn}
                />
            </View>

            <View style={styles.footer}>
                <Pressable onPress={onForgotPassword} style={{ marginBottom: SPACING.md }}>
                    <Text style={[styles.linkText, { color: colors.textMuted }]}>¿Olvidaste tu contraseña?</Text>
                </Pressable>
                <Pressable onPress={onSwitchToRegister}>
                    <Text style={[styles.linkText, { color: colors.textMuted }]}>
                        ¿No tienes una cuenta? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Regístrate</Text>
                    </Text>
                </Pressable>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: 450,
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 32,
    },
    formGroup: {
        width: '100%',
    },
    submitBtn: {
        marginTop: SPACING.sm,
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#edf2f7', // Fallback border color or use colors.border
        paddingTop: 24,
    },
    linkText: {
        fontSize: 14,
    },
});
