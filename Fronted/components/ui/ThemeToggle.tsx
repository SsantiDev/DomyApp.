import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
    style?: ViewStyle | ViewStyle[];
}

export function ThemeToggle({ style }: ThemeToggleProps) {
    const { theme, toggleTheme, colors } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
                styles.themeToggle,
                { backgroundColor: pressed ? `${colors.primary}22` : 'transparent' },
                style as any
            ]}
            accessibilityLabel={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
        >
            {isDark ? (
                <Sun
                    size={22}
                    color={colors.primary}
                    strokeWidth={2}
                />
            ) : (
                <Moon
                    size={22}
                    color={colors.primary}
                    strokeWidth={2}
                />
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    themeToggle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
