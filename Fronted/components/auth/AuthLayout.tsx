import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING } from '../../constants/theme';

interface AuthLayoutProps {
    children: React.ReactNode;
    currentView: 'login' | 'register' | 'forgot-password';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, currentView }) => {
    const { colors, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <View style={[styles.container, isMobile && styles.containerMobile]}>
            {!isMobile && (
                <View style={[
                    styles.leftSide,
                    { backgroundColor: currentView === 'register' ? colors.background : (isDark ? '#1a1a2e' : colors.primary) }
                ]}>
                    <View style={styles.leftContent}>
                        {currentView === 'register' ? (
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.welcomeTitle, { color: colors.primary }]}>Únete a DomyApp</Text>
                                <Text style={[styles.welcomeSubtitle, { color: colors.textLight }]}>Crea tu cuenta para comenzar tu gestión.</Text>
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
            <View style={[styles.rightSide, isMobile && { padding: SPACING.lg }]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    leftContent: {
        maxWidth: 400,
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#ffffffcc',
        textAlign: 'center',
        lineHeight: 24,
    },
    rightSide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
