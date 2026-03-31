import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { useAuthForm } from '../hooks/useAuthForm';

export default function LoginScreen() {
    const { colors } = useTheme();
    const {
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
        handleConfirmReset,
    } = useAuthForm();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={styles.themeToggleContainer}>
                <ThemeToggle />
            </View>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <AuthLayout currentView={currentView}>
                    {currentView === 'login' && (
                        <LoginForm
                            data={loginData}
                            setData={(d) => { setLoginError(''); setLoginData(d); }}
                            onSubmit={handleLogin}
                            loading={loading}
                            onSwitchToRegister={() => setCurrentView('register')}
                            onForgotPassword={() => setCurrentView('forgot-password')}
                            errorMessage={loginError}
                        />
                    )}

                    {currentView === 'register' && (
                        <RegisterForm
                            data={registerData}
                            setData={setRegisterData}
                            onSubmit={handleRegister}
                            loading={loading}
                            onSwitchToLogin={() => setCurrentView('login')}
                        />
                    )}


                    {currentView === 'forgot-password' && (
                        <ForgotPasswordForm 
                            onBackToLogin={() => setCurrentView('login')}
                            onRequestReset={handleRequestReset}
                            onConfirmReset={handleConfirmReset}
                            loading={loading}
                        />
                    )}
                </AuthLayout>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    themeToggleContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        alignItems: 'flex-end',
        zIndex: 1000,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});
