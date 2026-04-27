import { StyleSheet } from 'react-native';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const getStyles = (colors: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: colors.background,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        padding: SPACING.lg,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.lg,
        fontWeight: '800',
        color: colors.text,
    },
    label: {
        fontSize: TYPOGRAPHY.xs,
        color: colors.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: SPACING.md,
        marginBottom: 4,
    },
    value: {
        fontSize: TYPOGRAPHY.sm,
        color: colors.text,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
        marginBottom: SPACING.md,
    },
    badgeText: {
        fontSize: TYPOGRAPHY.xs,
        fontWeight: '700',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        color: colors.text,
        minHeight: 80,
        textAlignVertical: 'top',
        marginTop: SPACING.sm,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginTop: SPACING.lg,
    },
    btn: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    btnText: {
        fontWeight: '700',
        fontSize: TYPOGRAPHY.sm,
    },
});
