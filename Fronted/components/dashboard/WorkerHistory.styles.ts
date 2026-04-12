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

        // Stats KPIs
        statsRow: {
            flexDirection: 'column',
            gap: SPACING.md,
            marginBottom: SPACING.xl,
        },
        statsSecondaryRow: {
            flexDirection: 'row',
            gap: SPACING.md,
        },
        // Base card — usada por todas las variantes
        statCardBase: {
            backgroundColor: colors.surface,
            borderRadius: RADIUS.xl,
            padding: SPACING.lg,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                },
                android: { elevation: 3 },
            }),
        },
        // Hero: full width, fila horizontal
        statCardHero: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopWidth: 3,
            borderTopColor: colors.primary,
        },
        // Secundarias: flex 1, columna centrada
        statCardSecondary: {
            flex: 1,
            alignItems: 'center',
            gap: 8,
            minHeight: 110,
            justifyContent: 'center',
        },
        statCardRating: {
            borderTopWidth: 3,
            borderTopColor: colors.success,
        },
        statCardJobs: {
            borderTopWidth: 3,
            borderTopColor: colors.warning,
        },
        statIcon: {
            width: 48,
            height: 48,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        statHeroLeft: {
            flex: 1,
            gap: 8,
        },
        statHeroValue: {
            fontSize: 32,
            fontWeight: '900',
            color: colors.primary,
            letterSpacing: -1,
        },
        statHeroLabel: {
            fontSize: 11,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            color: colors.text,
        },
        statHeroSub: {
            fontSize: 12,
            fontWeight: '500',
            color: colors.textMuted,
            marginTop: 2,
        },
        statValue: {
            fontSize: 28,
            fontWeight: '900',
            color: colors.text,
        },
        statLabel: {
            fontSize: 10,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            textAlign: 'center',
            color: colors.textLight,
        },

        // List section title
        sectionTitle: {
            fontSize: 16,
            fontWeight: '800',
            color: colors.text,
            marginBottom: SPACING.md,
            letterSpacing: -0.3,
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
        statusText: {
            fontSize: 10,
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },

        // Meta rows
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
            color: colors.success,
        },

        // Stars
        starsRow: {
            flexDirection: 'row',
            gap: 3,
            marginTop: SPACING.sm,
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
