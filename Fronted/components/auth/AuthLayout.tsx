import React, { useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING } from '../../constants/theme';
import { getStyles } from './AuthLayout.styles';

interface AuthLayoutProps {
    children: React.ReactNode;
    currentView: 'login' | 'register' | 'forgot-password';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, currentView }) => {
    const { colors, isDark } = useTheme();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const styles = useMemo(() => getStyles(colors), [colors]);

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

