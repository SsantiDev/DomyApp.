import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RADIUS, SPACING } from '../../constants/theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[] | any;
    variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'elevated' }) => {
    const { colors } = useTheme();

    const getCardStyle = () => {
        const base: any[] = [styles.base, { backgroundColor: colors.surface }];
        if (variant === 'elevated') base.push(styles.elevated);
        if (variant === 'outlined') base.push({ borderWidth: 1, borderColor: colors.border });
        return base;
    };

    return (
        <View style={[...getCardStyle(), style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        padding: SPACING.lg,
        borderRadius: RADIUS.xl,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
});
