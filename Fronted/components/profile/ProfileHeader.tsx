import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { UserDetail } from '../../types/auth';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { Edit3, Check, X } from 'lucide-react-native';

interface Props {
    user: UserDetail;
    isEditing?: boolean;
    onEdit?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    isSaving?: boolean;
}

const roleLabel: Record<string, string> = {
    CLIENT: 'Cliente',
    WORKER: 'Operario',
    ADMIN: 'Administrador',
};

const roleColor: Record<string, string> = {
    CLIENT: '#4CAF93',
    WORKER: '#7B61FF',
    ADMIN: '#E07B39',
};

function getInitials(firstName: string, lastName: string): string {
    const f = firstName?.trim()?.[0]?.toUpperCase() ?? '';
    const l = lastName?.trim()?.[0]?.toUpperCase() ?? '';
    return f + l || '?';
}

export default function ProfileHeader({
    user,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    isSaving
}: Props) {
    const { colors } = useTheme();
    const initials = getInitials(user.first_name, user.last_name);
    const color = roleColor[user.role] ?? colors.primary;
    const label = roleLabel[user.role] ?? user.role;

    const dynamicStyles = StyleSheet.create({
        container: {
            alignItems: 'center',
            paddingTop: 16,
            paddingBottom: 40,
            paddingHorizontal: 20,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        controlsRow: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 24,
            minHeight: 40,
        },
        avatar: {
            width: 96,
            height: 96,
            borderRadius: 48,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 8,
        },
        initials: {
            fontSize: 36,
            fontWeight: '700',
            color: '#FFFFFF',
            letterSpacing: 1,
        },
        name: {
            fontSize: 24,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 4,
        },
        email: {
            fontSize: 14,
            color: colors.textLight,
            marginBottom: 16,
        },
        badge: {
            paddingHorizontal: 16,
            paddingVertical: 6,
            borderRadius: 20,
        },
        badgeText: {
            fontSize: 13,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: RADIUS.md,
            gap: 6,
        },
        editBtn: {
            backgroundColor: colors.primary + '15',
        },
        saveBtn: {
            backgroundColor: colors.primary,
        },
        cancelBtn: {
            backgroundColor: colors.border,
        },
        btnText: {
            fontSize: 14,
            fontWeight: '600',
        }
    });

    return (
        <View style={dynamicStyles.container}>
            <View style={dynamicStyles.controlsRow}>
                {isEditing ? (
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity onPress={onCancel} style={[dynamicStyles.actionButton, dynamicStyles.cancelBtn]}>
                            <X size={18} color={colors.textLight} />
                            <Text style={[dynamicStyles.btnText, { color: colors.textLight }]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onSave}
                            style={[dynamicStyles.actionButton, dynamicStyles.saveBtn]}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <>
                                    <Check size={18} color="#FFF" />
                                    <Text style={[dynamicStyles.btnText, { color: '#FFF' }]}>Guardar</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={onEdit} style={[dynamicStyles.actionButton, dynamicStyles.editBtn]}>
                        <Edit3 size={18} color={colors.primary} />
                        <Text style={[dynamicStyles.btnText, { color: colors.primary }]}>Editar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={[dynamicStyles.avatar, { backgroundColor: color }]}>
                <Text style={dynamicStyles.initials}>{initials}</Text>
            </View>

            <Text style={dynamicStyles.name}>
                {user.first_name} {user.last_name}
            </Text>

            <Text style={dynamicStyles.email}>{user.email}</Text>

            <View style={[dynamicStyles.badge, { backgroundColor: `${color}22` }]}>
                <Text style={[dynamicStyles.badgeText, { color }]}>{label}</Text>
            </View>
        </View>
    );
}
