import { StyleSheet } from 'react-native';
import { ThemeColors, RADIUS, SPACING } from '../../constants/theme';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: SPACING.md,
        paddingBottom: SPACING.xxl,
        paddingHorizontal: 20,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    controlsRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: SPACING.lg,
        minHeight: 40,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    initials: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        marginBottom: SPACING.xs,
    },
    email: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: SPACING.md,
    },
    badge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.smd,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        gap: 6,
    },
    editBtn: {
        backgroundColor: colors.primary + '15',
    },
    saveBtn: {
        backgroundColor: colors.primary,
    },
    cancelBtn: {
        backgroundColor: colors.border,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
