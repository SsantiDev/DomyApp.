import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: SPACING.lg,
    },
    heading: {
        fontSize: TYPOGRAPHY.xl,
        fontWeight: '800',
        color: colors.text,
        marginBottom: SPACING.lg,
    },
    cardsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    card: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardLabel: {
        fontSize: TYPOGRAPHY.xs,
        color: colors.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: TYPOGRAPHY.xl,
        fontWeight: '800',
        color: colors.text,
    },
    trendUp: { color: '#48bb78' },
    trendDown: { color: '#f56565' },
    trendNeutral: { color: '#a0aec0' },
    chartSection: {
        backgroundColor: colors.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chartTitle: {
        fontSize: TYPOGRAPHY.sm,
        fontWeight: '700',
        color: colors.text,
        marginBottom: SPACING.md,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        gap: SPACING.sm,
    },
    barLabel: {
        width: 40,
        fontSize: TYPOGRAPHY.xs,
        color: colors.textMuted,
        textAlign: 'right',
    },
    barTrack: {
        flex: 1,
        height: 12,
        backgroundColor: colors.border,
        borderRadius: RADIUS.full,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: RADIUS.full,
    },
    barValue: {
        width: 50,
        fontSize: TYPOGRAPHY.xs,
        color: colors.textLight,
    },
    note: {
        fontSize: TYPOGRAPHY.xs,
        color: colors.textMuted,
        marginTop: SPACING.lg,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
