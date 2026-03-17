import api from './api';
import { WorkerProfile } from '../types/auth';

export interface VerificationReview {
    pk: number;
    action: 'approve' | 'reject';
    reason?: string;
}

export const getPendingVerifications = async (): Promise<any[]> => {
    const response = await api.get('users/admin/pending-verifications/');
    return response.data;
};

export const processVerification = async (pk: number, action: 'approve' | 'reject', reason: string = '') => {
    const response = await api.post(`users/admin/verify-worker/${pk}/`, { action, reason });
    return response.data;
};
