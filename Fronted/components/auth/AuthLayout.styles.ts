import { StyleSheet } from 'react-native';
import { ThemeColors, SPACING } from '../../constants/theme';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    containerMobile: {
        flexDirection: 'column',
    },
    leftSide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xxl,
    },
    leftContent: {
        maxWidth: 400,
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: colors.white + 'CC',
        textAlign: 'center',
        lineHeight: 24,
    },
    rightSide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
