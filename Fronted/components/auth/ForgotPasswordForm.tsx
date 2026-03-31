import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/NativeCard';
import { Button } from '../ui/NativeButton';
import { SPACING, RADIUS } from '../../constants/theme';
import { Mail, Lock, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react-native';

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
    onRequestReset: (email: string) => Promise<boolean>;
    onConfirmReset: (email: string, code: string, newPass: string) => Promise<boolean>;
    loading: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    onBackToLogin,
    onRequestReset,
    onConfirmReset,
    loading
}) => {
    const { colors } = useTheme();
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const clearMessages = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleSendCode = async () => {
        clearMessages();
        if (!email.trim()) {
            setErrorMessage('Por favor ingresa tu correo electrónico.');
            return;
        }
        const success = await onRequestReset(email);
        if (success) {
            setSuccessMessage(`Código enviado a ${email}. Revisa tu bandeja.`);
            setStep(2);
        } else {
            setErrorMessage('No pudimos enviar el código. Verifica tu correo e intenta de nuevo.');
        }
    };

    const handleReset = async () => {
        clearMessages();
        if (!code.trim() || code.length < 6) {
            setErrorMessage('Ingresa el código completo de 6 dígitos.');
            return;
        }
        if (newPass.length < 6) {
            setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (newPass !== confirmPass) {
            setErrorMessage('Las contraseñas no coinciden. Verifícalas.');
            return;
        }
        const success = await onConfirmReset(email, code, newPass);
        if (!success) {
            setErrorMessage('Código incorrecto o expirado. Verifica e intenta de nuevo.');
        }
    };

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Pressable onPress={() => { clearMessages(); step === 1 ? onBackToLogin() : setStep(1); }} style={styles.backBtn}>
                    <ArrowLeft size={20} color={colors.textLight} />
                </Pressable>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
                </Text>
            </View>

            <Text style={[styles.infoText, { color: colors.textMuted }]}>
                {step === 1
                    ? 'Ingresa tu correo para recibir un código de seguridad.'
                    : `Ingresa el código que enviamos a ${email}`}
            </Text>

            {/* ── Error Banner ── */}
            {!!errorMessage && (
                <View style={styles.errorBanner}>
                    <AlertCircle size={16} color="#DC2626" style={{ marginRight: 8, flexShrink: 0 }} />
                    <Text style={styles.errorBannerText}>{errorMessage}</Text>
                </View>
            )}

            {/* ── Success Banner ── */}
            {!!successMessage && (
                <View style={styles.successBanner}>
                    <CheckCircle size={16} color="#059669" style={{ marginRight: 8, flexShrink: 0 }} />
                    <Text style={styles.successBannerText}>{successMessage}</Text>
                </View>
            )}

            {step === 1 ? (
                <View style={styles.inputGroup}>
                    <View style={styles.inputWrapper}>
                        <Mail size={18} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: errorMessage ? '#DC2626' : colors.border }]}
                            placeholder="Tu correo electrónico"
                            placeholderTextColor={colors.textMuted}
                            value={email}
                            onChangeText={(t) => { setEmail(t); clearMessages(); }}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                    <Button
                        title="Enviar código"
                        onPress={handleSendCode}
                        loading={loading}
                        style={{ marginTop: 4 }}
                    />
                </View>
            ) : (
                <View style={styles.inputGroup}>
                    <View style={styles.inputWrapper}>
                        <ShieldCheck size={18} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            placeholder="Código de 6 dígitos"
                            placeholderTextColor={colors.textMuted}
                            value={code}
                            onChangeText={(t) => { setCode(t); clearMessages(); }}
                            keyboardType="numeric"
                            maxLength={6}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Lock size={18} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            placeholder="Nueva contraseña"
                            placeholderTextColor={colors.textMuted}
                            value={newPass}
                            onChangeText={(t) => { setNewPass(t); clearMessages(); }}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Lock size={18} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: newPass && confirmPass && newPass !== confirmPass ? '#DC2626' : colors.border }]}
                            placeholder="Confirmar contraseña"
                            placeholderTextColor={colors.textMuted}
                            value={confirmPass}
                            onChangeText={(t) => { setConfirmPass(t); clearMessages(); }}
                            secureTextEntry
                        />
                    </View>
                    <Button
                        title="Restablecer contraseña"
                        onPress={handleReset}
                        loading={loading}
                        style={{ marginTop: 4 }}
                    />
                </View>
            )}

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
        padding: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    backBtn: {
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1,
    },
    infoText: {
        marginBottom: 16,
        fontSize: 14,
        lineHeight: 20,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
        borderWidth: 1,
        borderRadius: RADIUS.md,
        padding: 12,
        marginBottom: 16,
    },
    errorBannerText: {
        color: '#DC2626',
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    },
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        borderColor: '#BBF7D0',
        borderWidth: 1,
        borderRadius: RADIUS.md,
        padding: 12,
        marginBottom: 16,
    },
    successBannerText: {
        color: '#059669',
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    },
    inputGroup: {
        width: '100%',
        gap: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderRadius: RADIUS.md,
        paddingLeft: 40,
        paddingRight: 16,
        fontSize: 16,
    },
    footer: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#edf2f7',
        width: '100%',
        alignItems: 'center',
    },
    linkText: {
        fontWeight: 'bold',
        fontSize: 15,
    },
});
