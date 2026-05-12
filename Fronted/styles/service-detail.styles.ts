import { StyleSheet } from 'react-native';
import { SPACING, RADIUS } from '../constants/theme';

export const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        display: 'none', // Removed as we use Stack header
    },
    statusValueText: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    content: {
        flex: 1,
    },
    mapContainer: {
        height: 220,
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: colors.surface,
    },
    map: {
        flex: 1,
    },
    navBtn: {
        position: 'absolute',
        bottom: SPACING.md,
        right: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderRadius: RADIUS.full,
        gap: SPACING.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    navBtnText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 14,
    },
    marker: {
        padding: SPACING.sm,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    statusSection: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.md,
    },
    statusCard: {
        padding: SPACING.md,
        backgroundColor: 'transparent', // Card already sets surface color
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: RADIUS.full,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    actionsContainer: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
    },
    infoSection: {
        padding: SPACING.lg,
        gap: SPACING.lg,
    },
    infoCard: {
        padding: SPACING.xl,
        borderRadius: RADIUS.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.smd,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    categoryTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.xs,
    },
    detailText: {
        fontSize: 15,
        fontWeight: '500',
    },
    addressText: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '700',
    },
    detailsBox: {
        marginTop: SPACING.smd,
        padding: SPACING.smd,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: RADIUS.md,
    },
    detailsLabel: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: SPACING.xs,
    },
    detailsText: {
        fontSize: 14,
        lineHeight: 20,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: SPACING.xs,
        marginBottom: SPACING.sm,
    },
    reviewComment: {
        marginTop: SPACING.sm,
        padding: SPACING.smd,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: RADIUS.md,
        fontStyle: 'italic',
    },
    commentText: {
        fontSize: 15,
        lineHeight: 22,
    },
    footerSpace: {
        height: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    ratingModal: {
        padding: SPACING.xl,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        lineHeight: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: SPACING.smd,
        marginBottom: SPACING.lg,
    },
    commentInput: {
        width: '100%',
        borderWidth: 1,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        height: 120,
        textAlignVertical: 'top',
        fontSize: 15,
        marginBottom: SPACING.lg,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: SPACING.smd,
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    incidentItem: {
        marginTop: SPACING.smd,
        paddingTop: SPACING.smd,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    incidentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    incidentType: {
        fontSize: 14,
        fontWeight: '700',
    },
    incidentText: {
        fontSize: 14,
        lineHeight: 20,
    },
    miniBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: 10,
    },
    miniBadgeText: {
        fontSize: 10,
        fontWeight: '800',
    },
    inlineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.md,
        marginTop: SPACING.sm,
    },
    inlineButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
    },
    typeSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    typeOption: {
        paddingHorizontal: SPACING.smd,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1,
    },
    typeOptionText: {
        fontSize: 13,
        fontWeight: '600',
    },
    submitBtn: {
        flex: 2,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    submitBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
    },
    modalBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalBtn: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
