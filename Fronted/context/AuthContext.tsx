import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getAccessToken, removeTokens, saveTokens } from '../services/authStorage';
import api from '../services/api';

interface AuthContextType {
    user: any | null; // User can be improved strictly
    isLoading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (partial: Record<string, any>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const checkLoginStatus = async () => {
            try {
                const token = await getAccessToken();
                if (token) {
                    const response = await api.get('users/me/');
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                await removeTokens();
            } finally {
                setIsLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        try {
            console.log('Attempting login with credentials:', credentials);
            // 1. Get tokens
            const response = await api.post('auth/token/', credentials);
            const { access, refresh } = response.data;
            await saveTokens({ access, refresh });

            // 2. Fetch User Profile
            const userResponse = await api.get('users/me/');
            setUser(userResponse.data);
        } catch (error: any) {
            console.error('Error during login:', error);
            if (error.response && error.response.data) {
                throw new Error(error.response.data.detail || 'Error en inicio de sesión');
            }
            throw new Error(`Error al conectar con el servidor: ${error.message || 'Sin respuesta'}`);
        }
    };

    const register = async (data: any) => {
        try {
            console.log('Attempting register with payload:', data);
            const response = await api.post('users/register/', data);
            console.log('Register success:', response.data);
        } catch (error: any) {
            console.error('Error during register:', error);
            if (error.response && error.response.data) {
                // If the backend returns { "error": "message" }
                if (error.response.data.error) {
                    throw new Error(error.response.data.error);
                }
                // Handle standard DRF error objects (e.g. { "email": ["..."] })
                const errKey = Object.keys(error.response.data)[0];
                const errVal = error.response.data[errKey];
                const message = Array.isArray(errVal) ? errVal[0] : errVal;
                throw new Error(`${errKey}: ${message}`);
            }
            throw new Error(`Error al conectar con el servidor: ${error.message || 'Sin respuesta'}`);
        }
    };

    const logout = async () => {
        try {
            await removeTokens();
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const updateUser = (partial: Record<string, any>) => {
        setUser((prev: any) => prev ? { ...prev, ...partial } : prev);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
