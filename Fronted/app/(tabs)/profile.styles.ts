import { StyleSheet } from 'react-native';
import { ThemeColors, RADIUS, SPACING } from '../../constants/theme';

export const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        gap: 12,
    },
    loadingText: {
        color: colors.textLight,
        fontSize: 15,
        marginTop: 8,
    },
    errorText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    retryButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: 10,
        backgroundColor: colors.primary,
        borderRadius: RADIUS.md,
    },
    retryText: {
        color: colors.white,
        fontWeight: '600',
    },
    email: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 12,
    },
    logoutSection: {
        padding: SPACING.lg,
        marginTop: SPACING.sm,
    },
    logoutButton: {
        backgroundColor: isDark ? colors.danger + '22' : colors.danger + '15',
        paddingVertical: 14,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: isDark ? colors.danger : colors.danger + '40',
    },
    logoutText: {
        color: colors.danger,
        fontWeight: '700',
        fontSize: 16,
    },
});
