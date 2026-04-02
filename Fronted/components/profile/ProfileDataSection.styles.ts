import { StyleSheet } from 'react-native';
import { ThemeColors, SPACING, RADIUS } from '../../constants/theme';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
    section: {
        backgroundColor: colors.surface,
        marginTop: SPACING.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textLight,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        paddingVertical: SPACING.md,
    },
    row: {
        paddingVertical: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    label: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 4,
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '400',
    },
    empty: {
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    input: {
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: colors.primary + '11',
        minHeight: 40,
    },
});
