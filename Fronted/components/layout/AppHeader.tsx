import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserMenu } from '../ui/UserMenu';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';

export const AppHeader = () => {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.surface,
                borderBottomColor: colors.border,
            }
        ]}>
            <StatusBar style={isDark ? 'light' : 'dark'} translucent />
            <View style={[styles.content, { paddingTop: insets.top, height: 56 + insets.top }]}>
                <Text style={[styles.title, { color: colors.text }]}>Domy</Text>
                <View style={styles.rightContent}>
                    <ThemeToggle />
                    <UserMenu />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        zIndex: 1000,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    content: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
});
