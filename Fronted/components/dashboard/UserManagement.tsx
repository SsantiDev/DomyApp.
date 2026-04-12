import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './UserManagement.styles';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { AdminUser } from '../../types/auth';
import { Users, UserCheck, UserX } from 'lucide-react-native';
import { SPACING } from '../../constants/theme';

type RoleFilter = 'ALL' | 'CLIENT' | 'WORKER' | 'ADMIN';
type ActiveFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

const ROLE_LABELS: Record<string, string> = {
    CLIENT: 'Cliente',
    WORKER: 'Operaria',
    ADMIN: 'Admin',
};

const ROLE_COLORS = (colors: any): Record<string, string> => ({
    CLIENT: colors.primary,
    WORKER: colors.success,
    ADMIN: colors.warning,
});


export const UserManagement = () => {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const roleColors = useMemo(() => ROLE_COLORS(colors), [colors]);

    const { users, loading, error, fetchUsers, toggleUserActive, changeUserRole } = useAdminUsers();

    const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>('ALL');
    const [activePendingId, setActivePendingId] = useState<number | null>(null);
    const [rolePendingId, setRolePendingId] = useState<number | null>(null);

    const buildFilters = useCallback(
        (role: RoleFilter, active: ActiveFilter) => {
            const filters: Parameters<typeof fetchUsers>[0] = {};
            if (role !== 'ALL') filters.role = role;
            if (active === 'ACTIVE') filters.is_active = true;
            if (active === 'INACTIVE') filters.is_active = false;
            return filters;
        },
        []
    );

    useEffect(() => {
        fetchUsers(buildFilters(roleFilter, activeFilter));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // fetchUsers and buildFilters are stable useCallback refs (deps: [])
    }, [roleFilter, activeFilter]);

    const handleToggleActive = useCallback(
        async (user: AdminUser) => {
            const next = !user.is_active;
            const label = next ? 'activar' : 'desactivar';
            Alert.alert(
                'Confirmar acción',
                `¿Deseas ${label} a ${user.first_name} ${user.last_name}?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Confirmar',
                        style: next ? 'default' : 'destructive',
                        onPress: async () => {
                            setActivePendingId(user.id);
                            try {
                                await toggleUserActive(user.id, next);
                            } catch {
                                Alert.alert('Error', 'No se pudo actualizar el estado del usuario.');
                            } finally {
                                setActivePendingId(null);
                            }
                        },
                    },
                ]
            );
        },
        [toggleUserActive]
    );

    const handleChangeRole = useCallback(
        (user: AdminUser) => {
            const options = (['CLIENT', 'WORKER', 'ADMIN'] as const).filter((r) => r !== user.role).map((r) => ({
                text: ROLE_LABELS[r],
                onPress: async () => {
                    setRolePendingId(user.id);
                    try {
                        await changeUserRole(user.id, r);
                    } catch {
                        Alert.alert('Error', 'No se pudo cambiar el rol.');
                    } finally {
                        setRolePendingId(null);
                    }
                },
            }));
            Alert.alert(
                'Cambiar rol',
                `Rol actual: ${ROLE_LABELS[user.role]}\nElegir nuevo rol para ${user.first_name}:`,
                [...options, { text: 'Cancelar', style: 'cancel' as const }]
            );
        },
        [changeUserRole]
    );

    const RoleChip = ({ value, label }: { value: RoleFilter; label: string }) => {
        const active = roleFilter === value;
        return (
            <TouchableOpacity
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setRoleFilter(value)}
            >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    const ActiveChip = ({ value, label }: { value: ActiveFilter; label: string }) => {
        const active = activeFilter === value;
        return (
            <TouchableOpacity
                style={[styles.toggleChip, active && styles.toggleChipActive]}
                onPress={() => setActiveFilter(value)}
            >
                <Text style={[styles.toggleChipText, active && styles.toggleChipTextActive]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderUser = ({ item }: { item: AdminUser }) => {
        const isActivePending = activePendingId === item.id;
        const isRolePending = rolePendingId === item.id;
        const badgeBg = roleColors[item.role] ?? colors.primary;
        const initials =
            `${item.first_name?.[0] ?? ''}${item.last_name?.[0] ?? ''}`.toUpperCase() || '?';

        return (
            <View style={styles.userCard}>
                <View style={styles.cardTopRow}>
                    <View style={styles.avatarCircle}>
                        <Text style={{ fontWeight: '800', color: colors.primary, fontSize: 16 }}>
                            {initials}
                        </Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                            {item.first_name} {item.last_name}
                        </Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                    </View>
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: item.is_active ? colors.success : colors.danger },
                        ]}
                    />
                </View>

                <View style={styles.badgeRow}>
                    <View style={[styles.roleBadge, { backgroundColor: badgeBg }]}>
                        <Text style={styles.roleBadgeText}>{ROLE_LABELS[item.role]}</Text>
                    </View>
                    <Text style={styles.statusLabel}>
                        {item.is_active ? 'Activo' : 'Inactivo'}
                    </Text>
                    <Text style={[styles.dateJoined, { marginLeft: 'auto' as any }]}>
                        {new Date(item.date_joined).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            item.is_active ? styles.deactivateButton : styles.activateButton,
                        ]}
                        onPress={() => handleToggleActive(item)}
                        disabled={isActivePending || isRolePending}
                    >
                        {isActivePending ? (
                            <ActivityIndicator size="small" color={item.is_active ? colors.danger : colors.success} />
                        ) : item.is_active ? (
                            <>
                                <UserX size={14} color={colors.danger} />
                                <Text style={[styles.actionButtonText, { color: colors.danger, marginTop: 2 }]}>
                                    Desactivar
                                </Text>
                            </>
                        ) : (
                            <>
                                <UserCheck size={14} color={colors.success} />
                                <Text style={[styles.actionButtonText, { color: colors.success, marginTop: 2 }]}>
                                    Activar
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { borderColor: colors.border, backgroundColor: colors.background }]}
                        onPress={() => handleChangeRole(item)}
                        disabled={isActivePending || isRolePending}
                    >
                        {isRolePending ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <>
                                <Text style={[styles.actionButtonText, { color: colors.textLight }]}>
                                    Cambiar rol
                                </Text>
                                <Text style={[styles.actionButtonText, { color: colors.primary, marginTop: 1 }]}>
                                    {ROLE_LABELS[item.role]}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
                <Text style={styles.headerSubtitle}>
                    {users.length} usuario{users.length !== 1 ? 's' : ''} encontrado{users.length !== 1 ? 's' : ''}
                </Text>
            </View>

            <View style={styles.filterSection}>
                <FlatList
                    horizontal
                    data={[
                        { value: 'ALL', label: 'Todos' },
                        { value: 'CLIENT', label: 'Clientes' },
                        { value: 'WORKER', label: 'Operarias' },
                        { value: 'ADMIN', label: 'Admins' },
                    ]}
                    keyExtractor={(item) => item.value}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.filterRow]}
                    renderItem={({ item }) => (
                        <RoleChip value={item.value as RoleFilter} label={item.label} />
                    )}
                />
                <View style={styles.activeToggleRow}>
                    <ActiveChip value="ALL" label="Todos" />
                    <ActiveChip value="ACTIVE" label="Activos" />
                    <ActiveChip value="INACTIVE" label="Inactivos" />
                </View>
            </View>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderUser}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Users size={56} color={colors.textMuted} strokeWidth={1.5} />
                            <Text style={styles.emptyText}>Sin usuarios</Text>
                            <Text style={styles.emptySubtext}>
                                No hay usuarios que coincidan con los filtros aplicados.
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};
