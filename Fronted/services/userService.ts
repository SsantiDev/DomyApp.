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

export const uploadProfilePicture = async (imageUri: string): Promise<UserDetail> => {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() ?? 'photo.jpg';
    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    formData.append('profile_picture', { uri: imageUri, name: filename, type: mimeType } as any);
    const response = await api.patch<UserDetail>('users/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
