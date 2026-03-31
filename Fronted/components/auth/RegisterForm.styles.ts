import { StyleSheet } from 'react-native';
import { SPACING } from '../../constants/theme';

export const createStyles = (colors: any) => StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: 420,
        padding: SPACING.lg,
        alignSelf: 'center',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: SPACING.xl,
        color: colors.text,
    },
    formGroup: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        gap: SPACING.sm,
    },
    inputContainer: {
        flex: 1,
    },
    roleBtn: {
        borderWidth: 1.5,
        padding: SPACING.sm,
        borderRadius: 12,
        marginBottom: SPACING.md,
        marginTop: SPACING.xs,
        backgroundColor: colors.surface,
        borderColor: colors.primary + '40', // 25% opacity
    },
    roleBtnActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10', // 10% opacity
    },
    roleBtnText: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 14,
        color: colors.primary,
    },
    submitBtn: {
        marginTop: SPACING.sm,
        height: 48, // More compact
    },
    footer: {
        marginTop: SPACING.xl,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border || '#edf2f7',
        paddingTop: SPACING.lg,
    },
    linkText: {
        fontSize: 14,
        color: colors.textMuted,
    },
    linkTextBold: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});
