import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingVerifications, processVerification } from '../services/adminService';

export const ADMIN_PENDING_VERIFICATIONS_KEY = ['admin-pending-verifications'];

export const useAdminPendingVerifications = () => {
    return useQuery({
        queryKey: ADMIN_PENDING_VERIFICATIONS_KEY,
        queryFn: getPendingVerifications,
    });
};

export const useProcessVerification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ pk, action, reason }: { pk: number, action: 'approve' | 'reject', reason?: string }) =>
            processVerification(pk, action, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_PENDING_VERIFICATIONS_KEY });
        },
    });
};

export const ADMIN_SERVICES_KEY = ['admin-services'];
export const ADMIN_INCIDENTS_KEY = ['admin-incidents'];

import api from '../services/api';
import { ServiceRequest } from '../types/services';
import { Incident } from '../types/support';

export const useAdminServices = () => {
    return useQuery({
        queryKey: ADMIN_SERVICES_KEY,
        queryFn: async () => {
            const { data } = await api.get<ServiceRequest[]>('/services/requests/');
            // Backend currently returns a paginated response if ViewSet uses pagination, 
            // but ModelViewSet with standard DRF returns [] unless PageNumberPagination is set globally.
            // In Django standard, if page exists, it returns { count, next, previous, results }.
            return (data as any).results ? (data as any).results as ServiceRequest[] : data as ServiceRequest[];
        },
    });
};

export const useAdminIncidents = () => {
    return useQuery({
        queryKey: ADMIN_INCIDENTS_KEY,
        queryFn: async () => {
            const { data } = await api.get('/support/incidents/');
            return data.results ? data.results as Incident[] : data as Incident[];
        },
    });
};

export const useVerifyBilling = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (serviceId: number) => {
            const { data } = await api.post(`/services/requests/${serviceId}/verify_billing/`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_SERVICES_KEY });
        }
    });
};
