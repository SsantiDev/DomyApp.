import { StyleSheet } from 'react-native';
import { ThemeColors } from '../constants/theme';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    themeToggleContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        alignItems: 'flex-end',
        zIndex: 1000,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});
