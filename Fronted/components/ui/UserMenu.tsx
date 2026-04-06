import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { User, Settings, Moon, Sun, LogOut, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export const UserMenu: React.FC = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const triggerRef = useRef<View>(null);
  const { user, logout } = useAuth();
  const { toggleTheme, colors, isDark } = useTheme();
  const router = useRouter();

  const openMenu = () => {
    triggerRef.current?.measureInWindow((_x, y, _width, height) => {
      setDropdownTop(y + height + 4);
      setIsMenuVisible(true);
    });
  };

  const handleProfile = () => {
    setIsMenuVisible(false);
    router.push('/(tabs)/profile');
  };

  const handleSettings = () => {
    setIsMenuVisible(false);
    // TODO: Navigate to settings screen
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setIsMenuVisible(false);
  };

  const handleLogout = () => {
    setIsMenuVisible(false);
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const userName = user?.profile?.first_name || 'Usuario';

  return (
    <View>
      <Pressable
        ref={triggerRef}
        onPress={openMenu}
        style={({ pressed }) => [
          styles.trigger,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={[styles.avatarContainer, { backgroundColor: colors.border }]}>
          <User size={20} color={colors.primary} />
        </View>
        <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
          {userName}
        </Text>
        <ChevronDown size={16} color={colors.textMuted} />
      </Pressable>

      <Modal
        visible={isMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsMenuVisible(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                top: dropdownTop,
              },
            ]}
          >
            <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
              <User size={20} color={colors.textLight} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: colors.text }]}>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
              <Settings size={20} color={colors.textLight} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: colors.text }]}>Configuración</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleThemeToggle}>
              {isDark ? (
                <Sun size={20} color={colors.warning} style={styles.menuIcon} />
              ) : (
                <Moon size={20} color={colors.primary} style={styles.menuIcon} />
              )}
              <Text style={[styles.menuText, { color: colors.text }]}>
                {isDark ? 'Tema claro' : 'Tema oscuro'}
              </Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <LogOut size={20} color={colors.danger} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: colors.danger }]}>Cerrar sesión</Text>
            </TouchableOpacity>
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
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    maxWidth: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    right: SPACING.lg,
    width: 200,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  menuIcon: {
    marginRight: SPACING.md,
  },
  menuText: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.md,
  },
});
