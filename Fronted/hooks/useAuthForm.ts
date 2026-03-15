import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export type AuthView = 'login' | 'register' | 'forgot-password';

export const useAuthForm = () => {
    const { login, register } = useAuth();
    const router = useRouter();

    const [currentView, setCurrentView] = useState<AuthView>('login');
    const [loading, setLoading] = useState(false);

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
        if (!loginData.email || !loginData.password) {
            Alert.alert('Error', 'Por favor ingresa usuario y contraseña.');
            return;
        }

        setLoading(true);
        try {
            await login({ email: loginData.email.trim(), password: loginData.password });
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Error de Inicio de Sesión', error?.message || 'Credenciales inválidas');
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
            Alert.alert('¡Éxito!', `Usuario ${username} creado correctamente. Por favor inicia sesión.`);
            setCurrentView('login');
            setLoginData(prev => ({ ...prev, email }));
        } catch (error: any) {
            Alert.alert('Error de Registro', error?.message || 'Error al crear la cuenta');
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
        registerData,
        setRegisterData,
        handleLogin,
        handleRegister,
    };
};
