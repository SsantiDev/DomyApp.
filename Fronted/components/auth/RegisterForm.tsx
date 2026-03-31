import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/NativeCard';
import { Button } from '../ui/NativeButton';
import { NativeInput } from '../ui/NativeInput';
import { createStyles } from './RegisterForm.styles';

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
    const styles = useMemo(() => createStyles(colors), [colors]);

    const handleChange = (field: string, value: string) => {
        setData({ ...data, [field]: value });
    };

    const toggleRole = () => {
        setData({ ...data, role: data.role === 'CLIENT' ? 'WORKER' : 'CLIENT' });
    };

    const isClient = data.role === 'CLIENT';

    return (
        <Card style={styles.card}>
            <Text style={styles.cardTitle}>Crear Cuenta</Text>

            <View style={styles.formGroup}>
                <View style={styles.row}>
                    <NativeInput
                        label="Nombres"
                        placeholder="Juan"
                        value={data.firstName}
                        onChangeText={(val) => handleChange('firstName', val)}
                        editable={!loading}
                        containerStyle={styles.inputContainer}
                        compact // Supposing compact mode for NativeInput
                    />
                    <NativeInput
                        label="Apellidos"
                        placeholder="Pérez"
                        value={data.lastName}
                        onChangeText={(val) => handleChange('lastName', val)}
                        editable={!loading}
                        containerStyle={styles.inputContainer}
                        compact
                    />
                </View>

                <NativeInput
                    label="Usuario"
                    placeholder="juanperez"
                    value={data.username}
                    onChangeText={(val) => handleChange('username', val)}
                    editable={!loading}
                    autoCapitalize="none"
                    compact
                />

                <NativeInput
                    label="Correo Electrónico"
                    placeholder="juan@ejemplo.com"
                    value={data.email}
                    onChangeText={(val) => handleChange('email', val)}
                    editable={!loading}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    compact
                />

                <NativeInput
                    label="Contraseña"
                    placeholder="********"
                    value={data.password}
                    onChangeText={(val) => handleChange('password', val)}
                    editable={!loading}
                    secureTextEntry
                    compact
                />


                <Pressable
                    onPress={toggleRole}
                    style={[styles.roleBtn, !isClient && styles.roleBtnActive]}
                >
                    <Text style={styles.roleBtnText}>
                        Rol: {isClient ? 'Cliente' : 'Trabajador'} (Tocar para cambiar)
                    </Text>
                </Pressable>

                <Button
                    title="Registrarse"
                    onPress={onSubmit}
                    loading={loading}
                    style={styles.submitBtn}
                    compact
                />

            </View>

            <View style={styles.footer}>
                <Pressable onPress={onSwitchToLogin}>
                    <Text style={styles.linkText}>
                        ¿Ya tienes una cuenta? <Text style={styles.linkTextBold}>Inicia sesión</Text>
                    </Text>
                </Pressable>
            </View>
        </Card>
    );
};

