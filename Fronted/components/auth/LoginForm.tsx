import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/NativeCard';
import { Button } from '../ui/NativeButton';
import { NativeInput } from '../ui/NativeInput';
import { SPACING } from '../../constants/theme';
import { AlertCircle } from 'lucide-react-native';
import { getStyles } from './LoginForm.styles';

interface LoginFormProps {
    data: any;
    setData: (data: any) => void;
    onSubmit: () => void;
    loading: boolean;
    onSwitchToRegister: () => void;
    onForgotPassword: () => void;
    errorMessage?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    data,
    setData,
    onSubmit,
    loading,
    onSwitchToRegister,
    onForgotPassword,
    errorMessage,
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <Card style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar Sesión</Text>

            {/* ── Error Banner ── */}
            {!!errorMessage && (
                <View style={styles.errorBanner}>
                    <AlertCircle size={16} color={colors.danger} style={{ marginRight: SPACING.sm, flexShrink: 0 }} />
                    <Text style={styles.errorBannerText}>{errorMessage}</Text>
                </View>
            )}

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

