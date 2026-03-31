import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
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
    icon?: React.ReactNode;
    compact?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
    compact = false,
}) => {
    const { colors } = useTheme();
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const isOutline = variant === 'outline';

    const getButtonStyle = () => {
        const base: ViewStyle[] = [styles.base];
        if (compact) base.push(styles.compactBase);
        if (isPrimary) base.push({ backgroundColor: colors.primary });
        if (isSecondary) base.push({ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border });
        if (isOutline) base.push({ backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary });
        if (disabled) base.push({ backgroundColor: colors.border, opacity: 0.6 });
        return base;
    };

    const getTextStyle = () => {
        const base: TextStyle[] = [styles.text];
        if (compact) base.push(styles.compactText);
        if (isPrimary) base.push({ color: colors.white });
        if (isSecondary) base.push({ color: colors.text });
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
                <View style={styles.content}>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={[...getTextStyle(), textStyle as any]}>
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        padding: SPACING.md,
        borderRadius: RADIUS.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    compactBase: {
        padding: SPACING.sm,
        minHeight: 44,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 8,
    },
    text: {
        fontSize: TYPOGRAPHY.h3.fontSize,
        fontWeight: TYPOGRAPHY.h3.fontWeight,
    },
    compactText: {
        fontSize: TYPOGRAPHY.caption.fontSize,
    },
});

