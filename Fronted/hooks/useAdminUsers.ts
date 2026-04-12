import { useState, useCallback } from 'react';
import api from '../services/api';
import { AdminUser } from '../types/auth';

interface UserFilters {
    role?: 'CLIENT' | 'WORKER' | 'ADMIN';
    is_active?: boolean;
}

interface UseAdminUsersReturn {
    users: AdminUser[];
    loading: boolean;
    error: string | null;
    fetchUsers: (filters?: UserFilters) => Promise<void>;
    toggleUserActive: (id: number, is_active: boolean) => Promise<void>;
    changeUserRole: (id: number, role: 'CLIENT' | 'WORKER' | 'ADMIN') => Promise<void>;
}

export const useAdminUsers = (): UseAdminUsersReturn => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async (filters?: UserFilters) => {
        setLoading(true);
        setError(null);
        try {
            const params: Record<string, string> = {};
            if (filters?.role) {
                params.role = filters.role;
            }
            if (filters?.is_active !== undefined) {
                params.is_active = String(filters.is_active);
            }
            const response = await api.get<{ results: AdminUser[] } | AdminUser[]>('users/admin/users/', { params });
            setUsers((response.data as { results: AdminUser[] }).results ?? (response.data as AdminUser[]));
        } catch (err: any) {
            setError(err?.response?.data?.error || err?.response?.data?.detail || err?.response?.data?.message || 'Error al cargar usuarios.');
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleUserActive = useCallback(async (id: number, is_active: boolean) => {
        setError(null);
        try {
            const response = await api.patch<{ data: AdminUser } | AdminUser>(`users/admin/users/${id}/`, { is_active });
            const updated = (response.data as { data: AdminUser }).data ?? response.data as AdminUser;
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, is_active: updated.is_active } : u))
            );
        } catch (err: any) {
            setError(err?.response?.data?.error || err?.response?.data?.detail || err?.response?.data?.message || 'Error al actualizar el usuario.');
            throw err;
        }
    }, []);

    const changeUserRole = useCallback(async (id: number, role: 'CLIENT' | 'WORKER' | 'ADMIN') => {
        setError(null);
        try {
            const response = await api.patch<{ data: AdminUser } | AdminUser>(`users/admin/users/${id}/`, { role });
            const updated = (response.data as { data: AdminUser }).data ?? response.data as AdminUser;
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, role: updated.role } : u))
            );
        } catch (err: any) {
            setError(err?.response?.data?.error || err?.response?.data?.detail || err?.response?.data?.message || 'Error al cambiar el rol.');
            throw err;
        }
    }, []);

    return { users, loading, error, fetchUsers, toggleUserActive, changeUserRole };
};
