import { StyleSheet } from 'react-native';
import { ThemeColors, SPACING, RADIUS } from '../../constants/theme';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: 450,
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: colors.text,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.danger + '15',
        borderColor: colors.danger + '40',
        borderWidth: 1,
        borderRadius: RADIUS.md,
        padding: SPACING.smd,
        marginBottom: SPACING.md,
    },
    errorBannerText: {
        color: colors.danger,
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    },
    formGroup: {
        width: '100%',
    },
    submitBtn: {
        marginTop: SPACING.sm,
    },
    footer: {
        marginTop: SPACING.xl,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: SPACING.lg,
    },
    linkText: {
        fontSize: 14,
    },
});
