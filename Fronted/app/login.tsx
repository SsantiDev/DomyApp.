import React, { useState } from 'react';
import { Alert, ActivityIndicator, View, Text, TextInput, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthView = 'login' | 'register' | 'forgot-password';

export default function LoginScreen() {
    const { login, register } = useAuth();
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [currentView, setCurrentView] = useState<AuthView>('login');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [regFirstName, setRegFirstName] = useState('');
    const [regLastName, setRegLastName] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regRole, setRegRole] = useState('CLIENT');
    const [regLoading, setRegLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Por favor ingresa usuario y contraseña.');
            return;
        }

        setLoading(true);
        try {
            await login({ email: username.trim(), password });
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Error de Inicio de Sesión', error?.message || 'Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!regFirstName || !regLastName || !regUsername || !regEmail || !regPassword) {
            Alert.alert('Error', 'Por favor, llena todos los campos.');
            return;
        }

        setRegLoading(true);
        try {
            const payload = {
                first_name: regFirstName.trim(),
                last_name: regLastName.trim(),
                username: regUsername.trim(),
                email: regEmail.trim(),
                password: regPassword,
                role: regRole,
            };
            await register(payload);
            Alert.alert('¡Éxito!', `Usuario ${regUsername} creado correctamente. Por favor inicia sesión.`);
            setCurrentView('login');
            setUsername(regEmail);
            setPassword('');
        } catch (error: any) {
            Alert.alert('Error de Registro', error?.message || 'Error al crear la cuenta');
        } finally {
            setRegLoading(false);
        }
    };

    const dynamicStyles = StyleSheet.create({
        scrollContainer: {
            flexGrow: 1,
            backgroundColor: colors.background,
        },
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },
        themeToggleContainer: {
            position: 'absolute',
            top: 10,
            right: 20,
            zIndex: 1000,
        },
        container: {
            flex: 1,
            flexDirection: 'row',
        },
        containerMobile: {
            flexDirection: 'column',
        },
        leftSide: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 40,
        },
        leftSideLogin: {
            backgroundColor: isDark ? '#1a1a2e' : colors.primary,
        },
        leftSideRegister: {
            backgroundColor: colors.background,
        },
        leftContent: {
            maxWidth: 400,
            alignItems: 'center',
        },
        welcomeTitle: {
            fontSize: 32,
            fontWeight: 'bold',
            color: isDark ? colors.primary : '#ffffff',
            marginBottom: 16,
            textAlign: 'center',
        },
        welcomeSubtitle: {
            fontSize: 16,
            color: isDark ? colors.textLight : '#ffffffcc',
            textAlign: 'center',
            lineHeight: 24,
        },
        rightSide: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        card: {
            width: '100%',
            maxWidth: 450,
            backgroundColor: colors.surface,
            padding: 32,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 10,
            borderWidth: 1,
            borderColor: colors.border,
        },
        cardTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 32,
        },
        formGroup: {
            gap: 16,
        },
        row: {
            flexDirection: 'row',
            gap: 16,
        },
        input: {
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            borderRadius: 12,
            backgroundColor: isDark ? '#1e1e3f' : '#f8fafc',
            fontSize: 16,
            color: colors.text,
        },
        roleBtn: {
            borderWidth: 1,
            borderColor: colors.primary,
            padding: 16,
            borderRadius: 12,
            backgroundColor: isDark ? `${colors.primary}22` : '#ebf4ff',
        },
        roleBtnText: {
            textAlign: 'center',
            color: colors.primary,
            fontWeight: '600',
            fontSize: 16,
        },
        primaryBtn: {
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 8,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
        },
        primaryBtnText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
            letterSpacing: 0.5,
        },
        footer: {
            marginTop: 32,
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 24,
        },
        linkText: {
            color: colors.textMuted,
            fontSize: 14,
        },
        linkHighlight: {
            color: colors.primary,
            fontWeight: 'bold',
        },
    });

    return (
        <SafeAreaView style={dynamicStyles.safeArea}>
            <ScrollView contentContainerStyle={dynamicStyles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={dynamicStyles.themeToggleContainer}>
                    <ThemeToggle />
                </View>

                <View style={[dynamicStyles.container, isMobile && dynamicStyles.containerMobile]}>

                    {!isMobile && (
                        <View style={[dynamicStyles.leftSide, currentView === 'register' ? dynamicStyles.leftSideRegister : dynamicStyles.leftSideLogin]}>
                            <View style={dynamicStyles.leftContent}>
                                {currentView === 'register' ? (
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={[dynamicStyles.welcomeTitle, { color: colors.primary }]}>Únete a DomyApp</Text>
                                        <Text style={[dynamicStyles.welcomeSubtitle, { color: colors.textLight }]}>Crea tu cuenta para comenzar tu gestión.</Text>
                                    </View>
                                ) : (
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={dynamicStyles.welcomeTitle}>Bienvenido a DomyApp</Text>
                                        <Text style={dynamicStyles.welcomeSubtitle}>
                                            Accede a tu cuenta para disfrutar de todas las funcionalidades de nuestra plataforma.
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    <View style={[dynamicStyles.rightSide, isMobile && { padding: 20 }]}>
                        <View style={dynamicStyles.card}>

                            {currentView === 'login' && (
                                <View>
                                    <Text style={dynamicStyles.cardTitle}>Login</Text>
                                    <View style={dynamicStyles.formGroup}>
                                        <TextInput
                                            style={dynamicStyles.input}
                                            placeholder="Correo Electrónico"
                                            placeholderTextColor={colors.textMuted}
                                            value={username}
                                            onChangeText={setUsername}
                                            editable={!loading}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                        <TextInput
                                            style={dynamicStyles.input}
                                            placeholder="Password"
                                            placeholderTextColor={colors.textMuted}
                                            value={password}
                                            onChangeText={setPassword}
                                            editable={!loading}
                                            secureTextEntry
                                        />
                                        {loading ? (
                                            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 16 }} />
                                        ) : (
                                            <Pressable onPress={handleLogin} style={dynamicStyles.primaryBtn}>
                                                <Text style={dynamicStyles.primaryBtnText}>Iniciar Sesión</Text>
                                            </Pressable>
                                        )}
                                    </View>

                                    <View style={dynamicStyles.footer}>
                                        <Pressable onPress={() => setCurrentView('forgot-password')} style={{ marginBottom: 16 }}>
                                            <Text style={dynamicStyles.linkText}>¿Olvidaste tu contraseña?</Text>
                                        </Pressable>
                                        <Pressable onPress={() => setCurrentView('register')}>
                                            <Text style={dynamicStyles.linkText}>¿No tienes una cuenta? <Text style={dynamicStyles.linkHighlight}>Regístrate</Text></Text>
                                        </Pressable>
                                    </View>
                                </View>
                            )}

                            {currentView === 'register' && (
                                <View>
                                    <Text style={dynamicStyles.cardTitle}>Crear Cuenta</Text>
                                    <View style={dynamicStyles.formGroup}>
                                        <View style={dynamicStyles.row}>
                                            <TextInput
                                                style={[dynamicStyles.input, { flex: 1 }]}
                                                placeholder="Nombres"
                                                placeholderTextColor={colors.textMuted}
                                                value={regFirstName}
                                                onChangeText={setRegFirstName}
                                                editable={!regLoading}
                                            />
                                            <TextInput
                                                style={[dynamicStyles.input, { flex: 1 }]}
                                                placeholder="Apellidos"
                                                placeholderTextColor={colors.textMuted}
                                                value={regLastName}
                                                onChangeText={setRegLastName}
                                                editable={!regLoading}
                                            />
                                        </View>
                                        <TextInput
                                            style={dynamicStyles.input}
                                            placeholder="Username"
                                            placeholderTextColor={colors.textMuted}
                                            value={regUsername}
                                            onChangeText={setRegUsername}
                                            editable={!regLoading}
                                            autoCapitalize="none"
                                        />
                                        <TextInput
                                            style={dynamicStyles.input}
                                            placeholder="Correo Electrónico"
                                            placeholderTextColor={colors.textMuted}
                                            value={regEmail}
                                            onChangeText={setRegEmail}
                                            editable={!regLoading}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                        <TextInput
                                            style={dynamicStyles.input}
                                            placeholder="Contraseña"
                                            placeholderTextColor={colors.textMuted}
                                            value={regPassword}
                                            onChangeText={setRegPassword}
                                            editable={!regLoading}
                                            secureTextEntry
                                        />

                                        <Pressable
                                            onPress={() => setRegRole(prev => prev === 'CLIENT' ? 'WORKER' : 'CLIENT')}
                                            style={dynamicStyles.roleBtn}
                                        >
                                            <Text style={dynamicStyles.roleBtnText}>
                                                Rol: {regRole === 'CLIENT' ? 'Cliente' : 'Trabajador'} (Tocar para cambiar)
                                            </Text>
                                        </Pressable>

                                        {regLoading ? (
                                            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 16 }} />
                                        ) : (
                                            <Pressable onPress={handleRegister} style={dynamicStyles.primaryBtn}>
                                                <Text style={dynamicStyles.primaryBtnText}>Registrarse</Text>
                                            </Pressable>
                                        )}
                                    </View>

                                    <View style={dynamicStyles.footer}>
                                        <Pressable onPress={() => setCurrentView('login')}>
                                            <Text style={dynamicStyles.linkText}>¿Ya tienes una cuenta? <Text style={dynamicStyles.linkHighlight}>Inicia sesión</Text></Text>
                                        </Pressable>
                                    </View>
                                </View>
                            )}

                            {currentView === 'forgot-password' && (
                                <View>
                                    <Text style={dynamicStyles.cardTitle}>Recuperar Contraseña</Text>
                                    <Text style={[dynamicStyles.linkText, { textAlign: 'center', marginBottom: 24 }]}>La recuperación de contraseña está en construcción.</Text>
                                    <View style={dynamicStyles.footer}>
                                        <Pressable onPress={() => setCurrentView('login')}>
                                            <Text style={[dynamicStyles.linkText, dynamicStyles.linkHighlight]}>Volver al Login</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
