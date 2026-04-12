import { StyleSheet, Platform } from 'react-native';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const getStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.lg,
            paddingBottom: SPACING.xxl,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        },

        // Page header
        pageHeader: {
            marginBottom: SPACING.xl,
        },
        pageTitle: {
            ...TYPOGRAPHY.h2,
            color: colors.text,
            letterSpacing: -0.5,
        },
        pageSubtitle: {
            ...TYPOGRAPHY.caption,
            color: colors.textMuted,
            marginTop: SPACING.xs,
            fontWeight: '500',
        },

        // History card
        card: {
            backgroundColor: colors.surface,
            borderRadius: RADIUS.xl,
            marginBottom: SPACING.md,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
            ...Platform.select({
                ios: {
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 2,
                },
            }),
        },
        cardAccent: {
            height: 3,
            width: '100%',
        },
        cardBody: {
            padding: SPACING.lg,
        },
        cardTopRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: SPACING.sm,
        },
        categoryName: {
            ...TYPOGRAPHY.h3,
            color: colors.text,
            flex: 1,
            paddingRight: SPACING.sm,
        },

        // Status badge
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingHorizontal: SPACING.sm,
            paddingVertical: 4,
            borderRadius: RADIUS.full,
        },
        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
        },
        statusText: {
            fontSize: 10,
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },

        // Card meta rows
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.sm,
            marginTop: 6,
        },
        metaText: {
            ...TYPOGRAPHY.small,
            color: colors.textLight,
            fontWeight: '500',
            flex: 1,
        },

        // Price
        priceText: {
            fontSize: 15,
            fontWeight: '700',
            color: colors.primary,
        },

        // Stars
        starsRow: {
            flexDirection: 'row',
            gap: 3,
            marginTop: SPACING.sm,
        },

        // Divider
        cardDivider: {
            height: 1,
            backgroundColor: colors.border,
            marginHorizontal: SPACING.lg,
        },

        // Empty state
        emptyContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: SPACING.xxxl,
            gap: SPACING.md,
        },
        emptyIconWrap: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.categoryBg,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: SPACING.sm,
        },
        emptyTitle: {
            fontSize: 17,
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
        },
        emptySubtitle: {
            ...TYPOGRAPHY.small,
            color: colors.textMuted,
            textAlign: 'center',
        },
    });
