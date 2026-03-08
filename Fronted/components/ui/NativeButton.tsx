import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    const { colors } = useTheme();
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    const getButtonStyle = () => {
        const base: ViewStyle[] = [styles.base];
        if (isPrimary) base.push({ backgroundColor: colors.primary });
        if (isOutline) base.push({ backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary });
        if (disabled) base.push({ backgroundColor: colors.border, opacity: 0.6 });
        return base;
    };

    const getTextStyle = () => {
        const base: TextStyle[] = [styles.text];
        if (isPrimary) base.push({ color: colors.white });
        if (isOutline) base.push({ color: colors.primary });
        return base;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[...getButtonStyle(), style as any]}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? colors.white : colors.primary} />
            ) : (
                <Text style={[...getTextStyle(), textStyle as any]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        padding: SPACING.lg,
        borderRadius: RADIUS.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    text: {
        fontSize: TYPOGRAPHY.h3.fontSize,
        fontWeight: TYPOGRAPHY.h3.fontWeight,
    },
});
