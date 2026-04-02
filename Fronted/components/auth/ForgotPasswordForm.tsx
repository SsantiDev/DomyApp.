import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING } from '../../constants/theme';
import { Card } from '../ui/NativeCard';
import { Button } from '../ui/NativeButton';
import { Mail, Lock, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react-native';
import { getStyles } from './ForgotPasswordForm.styles';

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
    const styles = useMemo(() => getStyles(colors), [colors]);
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
                <Text style={styles.cardTitle}>
                    {step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
                </Text>
            </View>

            <Text style={styles.infoText}>
                {step === 1
                    ? 'Ingresa tu correo para recibir un código de seguridad.'
                    : `Ingresa el código que enviamos a ${email}`}
            </Text>

            {/* ── Error Banner ── */}
            {!!errorMessage && (
                <View style={styles.errorBanner}>
                    <AlertCircle size={16} color={colors.danger} style={{ marginRight: SPACING.sm, flexShrink: 0 }} />
                    <Text style={styles.errorBannerText}>{errorMessage}</Text>
                </View>
            )}

            {/* ── Success Banner ── */}
            {!!successMessage && (
                <View style={styles.successBanner}>
                    <CheckCircle size={16} color={colors.success} style={{ marginRight: SPACING.sm, flexShrink: 0 }} />
                    <Text style={styles.successBannerText}>{successMessage}</Text>
                </View>
            )}

            {step === 1 ? (
                <View style={styles.inputGroup}>
                    <View style={styles.inputWrapper}>
                        <Mail size={18} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: errorMessage ? colors.danger : colors.border }]}
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
                        style={{ marginTop: SPACING.xs }}
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
                            style={[styles.input, { color: colors.text, borderColor: newPass && confirmPass && newPass !== confirmPass ? colors.danger : colors.border }]}
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
                        style={{ marginTop: SPACING.xs }}
                    />
                </View>
            )}

            <View style={styles.footer}>
                <Pressable onPress={onBackToLogin}>
                    <Text style={styles.linkText}>Volver al Login</Text>
                </Pressable>
            </View>
        </Card>
    );
};

