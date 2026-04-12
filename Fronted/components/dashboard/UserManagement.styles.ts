import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { ThemeColors } from '../../constants/theme';

export const getStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.lg,
            paddingBottom: SPACING.md,
        },
        headerTitle: {
            ...TYPOGRAPHY.h2,
            color: colors.text,
        },
        headerSubtitle: {
            ...TYPOGRAPHY.caption,
            color: colors.textMuted,
            marginTop: SPACING.xs,
        },
        filterSection: {
            paddingBottom: SPACING.sm,
        },
        filterRow: {
            paddingHorizontal: SPACING.lg,
            gap: SPACING.sm,
        },
        filterChip: {
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.sm,
            borderRadius: RADIUS.full,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            marginRight: SPACING.sm,
        },
        filterChipActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        filterText: {
            ...TYPOGRAPHY.small,
            color: colors.textMuted,
            fontWeight: '600',
        },
        filterTextActive: {
            color: colors.white,
        },
        activeToggleRow: {
            flexDirection: 'row',
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.sm,
            gap: SPACING.sm,
        },
        toggleChip: {
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.sm,
            borderRadius: RADIUS.full,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
        },
        toggleChipActive: {
            borderColor: colors.primary,
            backgroundColor: colors.primary + '15',
        },
        toggleChipText: {
            ...TYPOGRAPHY.small,
            color: colors.textMuted,
            fontWeight: '600',
        },
        toggleChipTextActive: {
            color: colors.primary,
        },
        listContent: {
            paddingHorizontal: SPACING.lg,
            paddingBottom: SPACING.xxl,
        },
        userCard: {
            backgroundColor: colors.surface,
            borderRadius: RADIUS.lg,
            padding: SPACING.md,
            marginBottom: SPACING.sm,
            borderWidth: 1,
            borderColor: colors.border,
        },
        cardTopRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SPACING.sm,
        },
        avatarCircle: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.categoryBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SPACING.md,
        },
        userInfo: {
            flex: 1,
        },
        userName: {
            ...TYPOGRAPHY.caption,
            fontWeight: '700',
            color: colors.text,
        },
        userEmail: {
            ...TYPOGRAPHY.small,
            color: colors.textMuted,
            marginTop: 2,
        },
        statusDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginLeft: SPACING.sm,
        },
        badgeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.sm,
            marginBottom: SPACING.md,
        },
        roleBadge: {
            paddingHorizontal: SPACING.sm,
            paddingVertical: 3,
            borderRadius: RADIUS.sm,
        },
        roleBadgeText: {
            ...TYPOGRAPHY.small,
            fontWeight: '700',
            color: colors.white,
        },
        statusLabel: {
            ...TYPOGRAPHY.small,
            color: colors.textMuted,
        },
        actionRow: {
            flexDirection: 'row',
            gap: SPACING.sm,
        },
        actionButton: {
            flex: 1,
            paddingVertical: SPACING.sm,
            borderRadius: RADIUS.md,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
        },
        activateButton: {
            borderColor: colors.success,
            backgroundColor: colors.success + '15',
        },
        deactivateButton: {
            borderColor: colors.danger,
            backgroundColor: colors.danger + '15',
        },
        actionButtonText: {
            ...TYPOGRAPHY.small,
            fontWeight: '700',
        },
        rolePickerContainer: {
            flex: 1,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            overflow: 'hidden',
        },
        emptyContainer: {
            alignItems: 'center',
            marginTop: SPACING.xxl,
            paddingHorizontal: SPACING.lg,
        },
        emptyText: {
            ...TYPOGRAPHY.body,
            color: colors.textLight,
            fontWeight: '600',
            marginTop: SPACING.md,
            textAlign: 'center',
        },
        emptySubtext: {
            ...TYPOGRAPHY.caption,
            color: colors.textMuted,
            marginTop: SPACING.sm,
            textAlign: 'center',
        },
        loader: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        errorText: {
            ...TYPOGRAPHY.caption,
            color: colors.danger,
            textAlign: 'center',
            marginTop: SPACING.lg,
            paddingHorizontal: SPACING.lg,
        },
        dateJoined: {
            ...TYPOGRAPHY.small,
            color: colors.textMuted,
        },
    });
