import api from './api';
import { UserDetail, ClientProfile } from '../types/auth';

export const getProfile = async (): Promise<UserDetail> => {
    const response = await api.get<UserDetail>('users/me/');
    return response.data;
};

export const updateProfile = async (data: Partial<ClientProfile>): Promise<UserDetail> => {
    const response = await api.patch<UserDetail>('users/profile/', data);
    return response.data;
};
