import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface NativeInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    compact?: boolean;
}

export const NativeInput: React.FC<NativeInputProps> = ({
    label,
    error,
    containerStyle,
    inputStyle,
    compact,
    ...props
}) => {
    const { colors } = useTheme();

    return (
        <View style={[
            styles.container,
            compact && { marginBottom: SPACING.sm },
            containerStyle
        ]}>
            {label && (
                <Text style={[styles.label, { color: colors.textLight }]}>{label}</Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    compact && { padding: SPACING.sm },
                    {
                        borderColor: error ? colors.danger : colors.border,
                        color: colors.text,
                        backgroundColor: colors.surface,
                    },
                    inputStyle
                ]}
                placeholderTextColor={colors.textMuted}
                {...props}
            />

            {error && (
                <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: TYPOGRAPHY.small.fontSize,
        fontWeight: '600',
        marginBottom: SPACING.xs,
    },
    input: {
        borderWidth: 1,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        fontSize: TYPOGRAPHY.body.fontSize,
    },
    error: {
        fontSize: 12,
        marginTop: SPACING.xs,
    },
});
