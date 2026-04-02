import { StyleSheet } from 'react-native';
import { SPACING, RADIUS } from '../../constants/theme';

export const getStyles = (colors: any) => StyleSheet.create({
    container: {
        marginBottom: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: SPACING.sm,
        color: colors.text,
        fontSize: 15,
        paddingVertical: SPACING.sm,
    },
    filtersRow: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
    },
    filterChip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: SPACING.sm,
        backgroundColor: colors.surface,
    },
    filterChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterText: {
        fontSize: 13,
        color: colors.textMuted,
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#ffffff',
    },
    workerList: {
        paddingRight: SPACING.lg,
    },
    workerCard: {
        width: 240,
        backgroundColor: colors.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        marginRight: SPACING.md,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    workerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    workerName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    cityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cityText: {
        fontSize: 12,
        color: colors.textMuted,
        marginLeft: SPACING.xs,
    },
    bioText: {
        fontSize: 13,
        color: colors.textLight,
        marginBottom: SPACING.md,
        lineHeight: 18,
    },
    workerFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.warning + '15',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.sm,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.warning,
        marginLeft: SPACING.xs,
    },
    availableBadge: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.success,
        borderWidth: 2,
        borderColor: '#ffffff',
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    noResults: {
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noResultsText: {
        color: colors.textMuted,
        fontSize: 15,
        marginTop: SPACING.md,
    },

    // ── Rating Filter Row ──────────────────────────────────────────────────────
    ratingFilterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    ratingFilterLabel: {
        fontSize: 12,
        color: colors.textMuted,
        fontWeight: '600',
    },
    filterChipSmall: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.smd,
    },
    sortToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    sortToggleText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '700',
    },
    loadingWorkers: {
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: colors.danger,
        fontSize: 13,
    },
});
