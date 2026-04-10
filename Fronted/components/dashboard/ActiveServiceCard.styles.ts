import { StyleSheet } from 'react-native';
import { SPACING, RADIUS } from '../../constants/theme';

export const getStyles = (colors: any) => StyleSheet.create({
    statusCard: {
        borderRadius: RADIUS.xl + 4,
        padding: SPACING.lg,
        borderWidth: 1.5,
        elevation: 6,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 14,
        backgroundColor: colors.surface,
    },

    // ── Progress row ────────────────────────────────────────────────────────────
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    dotWrapper: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
    },
    progressDot: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    progressLineContainer: {
        flex: 1,
        height: 3,
        marginHorizontal: SPACING.xs,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressLineBase: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: colors.border,
    },
    progressLineFill: {
        height: 3,
        borderRadius: 2,
    },

    // ── Labels ──────────────────────────────────────────────────────────────────
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
        paddingHorizontal: 2,
    },
    progressLabel: {
        fontSize: 10,
        color: colors.textMuted,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
    },

    // ── Divider ─────────────────────────────────────────────────────────────────
    statusDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: SPACING.md,
    },

    // ── Service info ─────────────────────────────────────────────────────────────
    activeServiceName: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text,
        letterSpacing: -0.3,
    },
    addressText: {
        fontSize: 13,
        color: colors.textLight,
        marginTop: SPACING.xs,
        fontWeight: '500',
    },

    // ── Worker row ───────────────────────────────────────────────────────────────
    workerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    avatarMini: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    workerText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textLight,
        flex: 1,
    },

    // ── Track button ─────────────────────────────────────────────────────────────
    trackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.md,
        alignSelf: 'flex-start',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.smd,
        borderRadius: RADIUS.full,
    },
    trackButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
