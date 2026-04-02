import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { UserDetail } from '../../types/auth';
import { useTheme } from '../../context/ThemeContext';
import { SPACING } from '../../constants/theme';
import { Edit3, Check, X } from 'lucide-react-native';
import { getStyles } from './ProfileHeader.styles';

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
    const styles = useMemo(() => getStyles(colors), [colors]);
    const initials = getInitials(user.first_name, user.last_name);
    const color = roleColor[user.role] ?? colors.primary;
    const label = roleLabel[user.role] ?? user.role;

    return (
        <View style={styles.container}>
            <View style={styles.controlsRow}>
                {isEditing ? (
                    <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                        <TouchableOpacity onPress={onCancel} style={[styles.actionButton, styles.cancelBtn]}>
                            <X size={18} color={colors.textLight} />
                            <Text style={[styles.btnText, { color: colors.textLight }]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onSave}
                            style={[styles.actionButton, styles.saveBtn]}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <>
                                    <Check size={18} color="#FFF" />
                                    <Text style={[styles.btnText, { color: '#FFF' }]}>Guardar</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={onEdit} style={[styles.actionButton, styles.editBtn]}>
                        <Edit3 size={18} color={colors.primary} />
                        <Text style={[styles.btnText, { color: colors.primary }]}>Editar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={[styles.avatar, { backgroundColor: color }]}>
                <Text style={styles.initials}>{initials}</Text>
            </View>

            <Text style={styles.name}>
                {user.first_name} {user.last_name}
            </Text>

            <Text style={styles.email}>{user.email}</Text>

            <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
                <Text style={[styles.badgeText, { color }]}>{label}</Text>
            </View>
        </View>
    );
}
