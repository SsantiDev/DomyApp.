import { StyleSheet } from 'react-native';
import { ThemeColors, SPACING, RADIUS } from '../constants/theme';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
    },
    headerTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
    content: { padding: SPACING.lg },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
    },
    stepDot: { width: 30, height: 6, borderRadius: 3 },
    title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 8 },
    description: { fontSize: 15, color: colors.textLight, lineHeight: 22, marginBottom: SPACING.xl },
    uploadCard: {
        padding: SPACING.xl,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: colors.primary + '40',
        backgroundColor: colors.primary + '05',
        borderRadius: RADIUS.xl,
        marginBottom: SPACING.lg,
        gap: SPACING.smd,
    },
    preview: { width: '100%', height: 200, borderRadius: RADIUS.lg, marginTop: 12 },
    successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, gap: SPACING.lg },
    successTitle: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
    successDesc: { fontSize: 16, color: colors.textLight, textAlign: 'center', lineHeight: 24 },
});
