import { StyleSheet } from 'react-native';
import { ThemeColors, SPACING, RADIUS } from '../../constants/theme';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: 450,
        padding: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        width: '100%',
    },
    backBtn: {
        marginRight: SPACING.smd,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1,
        color: colors.text,
    },
    infoText: {
        marginBottom: SPACING.md,
        fontSize: 14,
        lineHeight: 20,
        color: colors.textMuted,
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
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success + '15',
        borderColor: colors.success + '40',
        borderWidth: 1,
        borderRadius: RADIUS.md,
        padding: SPACING.smd,
        marginBottom: SPACING.md,
    },
    successBannerText: {
        color: colors.success,
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    },
    inputGroup: {
        width: '100%',
        gap: SPACING.md,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: SPACING.smd,
        zIndex: 1,
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderRadius: RADIUS.md,
        paddingLeft: 40,
        paddingRight: SPACING.md,
        fontSize: 16,
        color: colors.text,
    },
    footer: {
        marginTop: SPACING.lg,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        width: '100%',
        alignItems: 'center',
    },
    linkText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: colors.primary,
    },
});
