import api from './api';
import { UserDetail, ClientProfile, WorkerProfile, UserRole } from '../types/auth';

export const getProfile = async (): Promise<UserDetail> => {
    const response = await api.get<UserDetail>('users/me/');
    return response.data;
};

export const updateProfile = async (
    data: Partial<ClientProfile | WorkerProfile>,
    role: UserRole
): Promise<UserDetail> => {
    const endpoint = role === 'WORKER' ? 'users/profile/worker/' : 'users/profile/';
    const response = await api.patch<UserDetail>(endpoint, data);
    return response.data;
};
