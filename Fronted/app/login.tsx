import React, { useState } from 'react';
import { Alert, ActivityIndicator, View, Text, TextInput, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

type AuthView = 'login' | 'register' | 'forgot-password';

function ThemeToggleLightweight() {
    const toggleTheme = () => {
        try {
            if (typeof window !== 'undefined') {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
            }
        } catch (e) { }
    };
    return (
        <Pressable onPress={toggleTheme} style={styles.themeBtn}>
            <Text style={styles.themeBtnText}>🌓 Tema</Text>
        </Pressable>
    );
}

export default function LoginScreen() {
    const { login, register } = useAuth();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 768; // Responsividad básica

    const [currentView, setCurrentView] = useState<AuthView>('login');

    // Formularios
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
            Alert.alert('Error', 'Please enter both username and password.');
            return;
        }

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

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.themeToggleContainer}>
                <ThemeToggleLightweight />
            </View>

            <View style={[styles.container, isMobile && styles.containerMobile]}>

                {/* LADO IZQUIERDO (Se oculta en móvil) */}
                {!isMobile && (
                    <View style={[styles.leftSide, currentView === 'register' ? styles.leftSideRegister : styles.leftSideLogin]}>
                        <View style={styles.leftContent}>
                            {currentView === 'register' ? (
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={styles.welcomeTitle}>Únete a DomyApp</Text>
                                    <Text style={styles.welcomeSubtitle}>Crea tu cuenta para comenzar tu gestión.</Text>
                                </View>
                            ) : (
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={styles.welcomeTitle}>Bienvenido a DomyApp</Text>
                                    <Text style={styles.welcomeSubtitle}>
                                        Accede a tu cuenta para disfrutar de todas las funcionalidades de nuestra plataforma.
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* LADO DERECHO (Formularios) */}
                <View style={[styles.rightSide, isMobile && { padding: 20 }]}>
                    <View style={styles.card}>

                        {currentView === 'login' && (
                            <View>
                                <Text style={styles.cardTitle}>Login</Text>
                                <View style={styles.formGroup}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Correo Electrónico"
                                        placeholderTextColor="#a0aec0"
                                        value={username}
                                        onChangeText={setUsername}
                                        editable={!loading}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor="#a0aec0"
                                        value={password}
                                        onChangeText={setPassword}
                                        editable={!loading}
                                        secureTextEntry
                                    />
                                    {loading ? (
                                        <View style={styles.loaderContainer}>
                                            <ActivityIndicator size="large" color="#667eea" />
                                        </View>
                                    ) : (
                                        <Pressable onPress={handleLogin} style={styles.primaryBtn}>
                                            <Text style={styles.primaryBtnText}>Iniciar Sesión</Text>
                                        </Pressable>
                                    )}
                                </View>

                                <View style={styles.footer}>
                                    <Pressable onPress={() => setCurrentView('forgot-password')} style={{ marginBottom: 16 }}>
                                        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                                    </Pressable>
                                    <Pressable onPress={() => setCurrentView('register')}>
                                        <Text style={styles.linkText}>¿No tienes una cuenta? <Text style={styles.linkHighlight}>Regístrate</Text></Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}

                        {currentView === 'register' && (
                            <View>
                                <Text style={styles.cardTitle}>Crear Cuenta</Text>
                                <View style={styles.formGroup}>
                                    <View style={styles.row}>
                                        <TextInput
                                            style={[styles.input, { flex: 1 }]}
                                            placeholder="Nombres"
                                            placeholderTextColor="#a0aec0"
                                            value={regFirstName}
                                            onChangeText={setRegFirstName}
                                            editable={!regLoading}
                                        />
                                        <TextInput
                                            style={[styles.input, { flex: 1 }]}
                                            placeholder="Apellidos"
                                            placeholderTextColor="#a0aec0"
                                            value={regLastName}
                                            onChangeText={setRegLastName}
                                            editable={!regLoading}
                                        />
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Username"
                                        placeholderTextColor="#a0aec0"
                                        value={regUsername}
                                        onChangeText={setRegUsername}
                                        editable={!regLoading}
                                        autoCapitalize="none"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Correo Electrónico"
                                        placeholderTextColor="#a0aec0"
                                        value={regEmail}
                                        onChangeText={setRegEmail}
                                        editable={!regLoading}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Contraseña"
                                        placeholderTextColor="#a0aec0"
                                        value={regPassword}
                                        onChangeText={setRegPassword}
                                        editable={!regLoading}
                                        secureTextEntry
                                    />

                                    <Pressable
                                        onPress={() => setRegRole(prev => prev === 'CLIENT' ? 'WORKER' : 'CLIENT')}
                                        style={styles.roleBtn}
                                    >
                                        <Text style={styles.roleBtnText}>
                                            Rol: {regRole === 'CLIENT' ? 'Cliente' : 'Trabajador'} (Tocar para cambiar)
                                        </Text>
                                    </Pressable>

                                    {regLoading ? (
                                        <View style={styles.loaderContainer}>
                                            <ActivityIndicator size="large" color="#667eea" />
                                        </View>
                                    ) : (
                                        <Pressable onPress={handleRegister} style={styles.primaryBtn}>
                                            <Text style={styles.primaryBtnText}>Registrarse</Text>
                                        </Pressable>
                                    )}
                                </View>

                                <View style={styles.footer}>
                                    <Pressable onPress={() => setCurrentView('login')}>
                                        <Text style={styles.linkText}>¿Ya tienes una cuenta? <Text style={styles.linkHighlight}>Inicia sesión</Text></Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}

                        {currentView === 'forgot-password' && (
                            <View>
                                <Text style={styles.cardTitle}>Recuperar Contraseña</Text>
                                <Text style={styles.constructionText}>La recuperación de contraseña está en construcción.</Text>
                                <View style={styles.footer}>
                                    <Pressable onPress={() => setCurrentView('login')}>
                                        <Text style={[styles.linkText, styles.linkHighlight]}>Volver al Login</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}

                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#f8fafc',
    },
    themeToggleContainer: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1000,
    },
    themeBtn: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    themeBtnText: {
        color: '#1a202c',
        fontWeight: '600',
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
        backgroundColor: '#1a1a2e',
    },
    leftSideRegister: {
        backgroundColor: '#f8fafc',
    },
    leftContent: {
        maxWidth: 400,
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 16,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#4a5568',
        textAlign: 'center',
        lineHeight: 24,
    },
    rightSide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    card: {
        width: '100%',
        maxWidth: 450,
        backgroundColor: '#ffffff',
        padding: 32,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a202c',
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
        borderColor: '#e2e8f0',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        fontSize: 16,
        color: '#1a202c',
    },
    roleBtn: {
        borderWidth: 1,
        borderColor: '#667eea',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#ebf4ff',
    },
    roleBtnText: {
        textAlign: 'center',
        color: '#4c51bf',
        fontWeight: '600',
        fontSize: 16,
    },
    loaderContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    primaryBtn: {
        backgroundColor: '#667eea',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#667eea',
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
        borderTopColor: '#e2e8f0',
        paddingTop: 24,
    },
    linkText: {
        color: '#718096',
        fontSize: 14,
    },
    linkHighlight: {
        color: '#667eea',
        fontWeight: 'bold',
    },
    constructionText: {
        textAlign: 'center',
        marginBottom: 24,
        color: '#718096',
        lineHeight: 24,
    }
});
