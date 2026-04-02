import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserMenu } from '../ui/UserMenu';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { getStyles } from './AppHeader.styles';

export const AppHeader = () => {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <StatusBar style={isDark ? 'light' : 'dark'} translucent />
            <View style={[styles.content, { paddingTop: insets.top, height: 56 + insets.top }]}>
                <Text style={styles.title}>Domy</Text>
                <View style={styles.rightContent}>
                    <ThemeToggle />
                    <UserMenu />
                </View>
            </View>
        </View>
    );
};

