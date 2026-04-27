import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const getStyles = (colors: any) => StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: colors.border,
        gap: SPACING.sm,
    },
    info: {
        flex: 1,
    },
    type: {
        fontSize: TYPOGRAPHY.sm,
        fontWeight: '600',
        color: colors.text,
    },
    meta: {
        fontSize: TYPOGRAPHY.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 3,
        borderRadius: RADIUS.full,
    },
    badgeText: {
        fontSize: TYPOGRAPHY.xs,
        fontWeight: '700',
    },
    empty: {
        alignItems: 'center',
        paddingVertical: SPACING.lg * 2,
    },
    emptyText: {
        color: colors.textLight,
        marginTop: SPACING.md,
        fontWeight: '600',
    },
});
