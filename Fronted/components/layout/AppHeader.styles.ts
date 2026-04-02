import { StyleSheet, Platform } from 'react-native';
import { ThemeColors, SPACING, TYPOGRAPHY } from '../../constants/theme';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        zIndex: 1000,
        backgroundColor: colors.surface,
        borderBottomColor: colors.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    content: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
    },
    title: {
        fontSize: TYPOGRAPHY.h3.fontSize,
        fontWeight: TYPOGRAPHY.h3.fontWeight,
        letterSpacing: 0.5,
        color: colors.text,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
});
