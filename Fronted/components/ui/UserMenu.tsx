import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { User, LogOut, Settings, Moon, Sun, UserCircle, Star } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const UserMenu = () => {
    const { user, logout } = useAuth();
    const { colors, toggleTheme, isDark } = useTheme();
    const [visible, setVisible] = useState(false);

    const isWorker = user?.role === 'WORKER';
    const averageRating = user?.profile?.average_rating;

    const handleLogout = async () => {
        setVisible(false);
        await logout();
    };

    const menuItems = [
        { label: 'Perfil', icon: User, onPress: () => setVisible(false) },
        { label: 'Configuración', icon: Settings, onPress: () => setVisible(false) },
        {
            label: isDark ? 'Modo Claro' : 'Modo Oscuro',
            icon: isDark ? Sun : Moon,
            onPress: () => toggleTheme()
        },
        { label: 'Cerrar Sesión', icon: LogOut, onPress: handleLogout, danger: true },
    ];

    return (
        <View>
            <TouchableOpacity
                style={styles.trigger}
                onPress={() => setVisible(true)}
            >
                <UserCircle size={24} color={colors.primary} />
                <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: colors.text }]}>
                        {user?.username || 'Usuario'}
                    </Text>
                    {isWorker && averageRating > 0 && (
                        <View style={[styles.ratingBadge, { backgroundColor: colors.warning + '10' }]}>
                            <Star size={10} color={colors.warning} fill={colors.warning} />
                            <Text style={[styles.ratingText, { color: colors.warning }]}>
                                {averageRating.toFixed(1)}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    <View style={[styles.menu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={item.onPress}
                            >
                                <item.icon
                                    size={20}
                                    color={item.danger ? colors.danger : colors.text}
                                />
                                <Text style={[
                                    styles.menuText,
                                    { color: item.danger ? colors.danger : colors.text }
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
    },
    userName: {
        marginLeft: SPACING.sm,
        fontSize: TYPOGRAPHY.body.fontSize,
        fontWeight: '700',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginLeft: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: RADIUS.sm,
    },
    ratingText: {
        fontSize: 11,
        fontWeight: '800',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'flex-start',
        paddingTop: 60,
        paddingLeft: SPACING.md,
    },
    menu: {
        width: 200,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        padding: SPACING.xs,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
    },
    menuText: {
        marginLeft: SPACING.md,
        fontSize: TYPOGRAPHY.body.fontSize,
    },
});
