import { StyleSheet } from 'react-native';
import { ThemeColors, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const getStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            width: '100%',
        },
        mapWrapper: {
            width: '100%',
            height: 220,
            borderRadius: RADIUS.lg,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: SPACING.sm,
        },
        map: {
            flex: 1,
        },
        loadingContainer: {
            width: '100%',
            height: 220,
            borderRadius: RADIUS.lg,
            backgroundColor: colors.categoryBg,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: SPACING.sm,
            gap: SPACING.sm,
        },
        loadingText: {
            fontSize: TYPOGRAPHY.caption.fontSize,
            color: colors.textLight,
            fontWeight: '500',
        },
        deniedContainer: {
            width: '100%',
            borderRadius: RADIUS.lg,
            backgroundColor: colors.categoryBg,
            alignItems: 'center',
            justifyContent: 'center',
            padding: SPACING.lg,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: SPACING.sm,
            gap: SPACING.sm,
        },
        deniedTitle: {
            fontSize: TYPOGRAPHY.caption.fontSize,
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
        },
        deniedSubtitle: {
            fontSize: TYPOGRAPHY.small.fontSize,
            color: colors.textLight,
            textAlign: 'center',
        },
        addressInput: {
            backgroundColor: colors.background,
            borderRadius: RADIUS.md,
            padding: SPACING.md,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.border,
            fontSize: TYPOGRAPHY.body.fontSize,
        },
        addressInputFocused: {
            borderColor: colors.primary,
        },
        hintRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.xs,
            marginTop: SPACING.xs,
        },
        hintText: {
            fontSize: TYPOGRAPHY.small.fontSize,
            color: colors.textMuted,
        },
        geocodingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.xs,
            marginTop: SPACING.xs,
        },
        geocodingText: {
            fontSize: TYPOGRAPHY.small.fontSize,
            color: colors.primary,
            fontWeight: '500',
        },
    });
