import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/NativeCard';
import { Button } from '../ui/NativeButton';
import { NativeInput } from '../ui/NativeInput';
import { SPACING } from '../../constants/theme';

interface RegisterFormProps {
    data: any;
    setData: (data: any) => void;
    onSubmit: () => void;
    loading: boolean;
    onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    data,
    setData,
    onSubmit,
    loading,
    onSwitchToLogin,
}) => {
    const { colors } = useTheme();

    return (
        <Card style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Crear Cuenta</Text>
            <View style={styles.formGroup}>
                <View style={styles.row}>
                    <NativeInput
                        label="Nombres"
                        placeholder="Juan"
                        value={data.firstName}
                        onChangeText={(val) => setData({ ...data, firstName: val })}
                        editable={!loading}
                        containerStyle={{ flex: 1, marginRight: SPACING.sm }}
                    />
                    <NativeInput
                        label="Apellidos"
                        placeholder="Pérez"
                        value={data.lastName}
                        onChangeText={(val) => setData({ ...data, lastName: val })}
                        editable={!loading}
                        containerStyle={{ flex: 1 }}
                    />
                </View>
                <NativeInput
                    label="Usuario"
                    placeholder="juanperez"
                    value={data.username}
                    onChangeText={(val) => setData({ ...data, username: val })}
                    editable={!loading}
                    autoCapitalize="none"
                />
                <NativeInput
                    label="Correo Electrónico"
                    placeholder="juan@ejemplo.com"
                    value={data.email}
                    onChangeText={(val) => setData({ ...data, email: val })}
                    editable={!loading}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <NativeInput
                    label="Contraseña"
                    placeholder="********"
                    value={data.password}
                    onChangeText={(val) => setData({ ...data, password: val })}
                    editable={!loading}
                    secureTextEntry
                />

                <Pressable
                    onPress={() => setData({ ...data, role: data.role === 'CLIENT' ? 'WORKER' : 'CLIENT' })}
                    style={[styles.roleBtn, { backgroundColor: colors.surface, borderColor: colors.primary }]}
                >
                    <Text style={[styles.roleBtnText, { color: colors.primary }]}>
                        Rol: {data.role === 'CLIENT' ? 'Cliente' : 'Trabajador'} (Tocar para cambiar)
                    </Text>
                </Pressable>

                <Button
                    title="Registrarse"
                    onPress={onSubmit}
                    loading={loading}
                    style={styles.submitBtn}
                />
            </View>

            <View style={styles.footer}>
                <Pressable onPress={onSwitchToLogin}>
                    <Text style={[styles.linkText, { color: colors.textMuted }]}>
                        ¿Ya tienes una cuenta? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Inicia sesión</Text>
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
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    roleBtn: {
        borderWidth: 1,
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: SPACING.md,
    },
    roleBtnText: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
    },
    submitBtn: {
        marginTop: SPACING.xs,
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#edf2f7',
        paddingTop: 24,
    },
    linkText: {
        fontSize: 14,
    },
});
