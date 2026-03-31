import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export type AuthView = 'login' | 'register' | 'forgot-password';

export const useAuthForm = () => {
    const { login, register } = useAuth();
    const router = useRouter();

    const [currentView, setCurrentView] = useState<AuthView>('login');
    const [loading, setLoading] = useState(false);

    // Inline error message for login (shown as banner inside form)
    const [loginError, setLoginError] = useState('');

    // Login State
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    // Register State
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        role: 'CLIENT' as 'CLIENT' | 'WORKER',
    });

    const handleLogin = async () => {
        setLoginError('');
        if (!loginData.email || !loginData.password) {
            setLoginError('Por favor ingresa tu correo y contraseña.');
            return;
        }

        setLoading(true);
        try {
            await login({ email: loginData.email.trim(), password: loginData.password });
            router.replace('/(tabs)');
        } catch (error: any) {
            // Translate technical JWT errors to friendly Spanish messages
            const raw = error?.message || '';
            if (
                raw.toLowerCase().includes('no active account') ||
                raw.toLowerCase().includes('credenciales') ||
                raw.toLowerCase().includes('invalid') ||
                raw.toLowerCase().includes('unauthorized') ||
                raw.toLowerCase().includes('401')
            ) {
                setLoginError('Correo o contraseña incorrectos. Por favor, verifica tus datos.');
            } else if (raw.toLowerCase().includes('network') || raw.toLowerCase().includes('connect')) {
                setLoginError('No se pudo conectar al servidor. Verifica tu conexión.');
            } else {
                setLoginError('Ocurrió un error al iniciar sesión. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        const { firstName, lastName, username, email, password, role } = registerData;
        if (!firstName || !lastName || !username || !email || !password) {
            Alert.alert('Error', 'Por favor, llena todos los campos.');
            return;
        }

        setLoading(true);
        try {
            await register({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                username: username.trim(),
                email: email.trim(),
                password,
                role,
            });
            Alert.alert('¡Éxito!', `Cuenta creada correctamente. Por favor inicia sesión.`);
            setCurrentView('login');
            setLoginData(prev => ({ ...prev, email }));
        } catch (error: any) {
            Alert.alert('Error de Registro', error?.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestReset = async (email: string): Promise<boolean> => {
        setLoading(true);
        try {
            await api.post('users/password-reset/request/', { email: email.trim() });
            return true;
        } catch (error: any) {
            console.error('Password reset request error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReset = async (email: string, code: string, newPass: string): Promise<boolean> => {
        setLoading(true);
        try {
            await api.post('users/password-reset/confirm/', {
                email: email.trim(),
                code: code.trim(),
                new_password: newPass
            });
            setCurrentView('login');
            return true;
        } catch (error: any) {
            console.error('Password reset confirm error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        currentView,
        setCurrentView,
        loading,
        loginData,
        setLoginData,
        loginError,
        setLoginError,
        registerData,
        setRegisterData,
        handleLogin,
        handleRegister,
        handleRequestReset,
        handleConfirmReset
    };
};
