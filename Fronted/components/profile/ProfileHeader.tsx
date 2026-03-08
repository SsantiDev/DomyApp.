import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserDetail } from '../../types/auth';

interface Props {
    user: UserDetail;
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

export default function ProfileHeader({ user }: Props) {
    const initials = getInitials(user.first_name, user.last_name);
    const color = roleColor[user.role] ?? '#4CAF93';
    const label = roleLabel[user.role] ?? user.role;

    return (
        <View style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
    },
    initials: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    badge: {
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
