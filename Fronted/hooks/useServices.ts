import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Category, ServiceRequest, CreateServiceRequestDTO, ServiceRequestNotification } from '../types/services';

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get<Category[]>('/services/categories/');
            return data;
        }
    });
};

export const useServiceRequests = () => {
    return useQuery({
        queryKey: ['service-requests'],
        queryFn: async () => {
            const { data } = await api.get<ServiceRequest[]>('/services/requests/');
            return data;
        },
        staleTime: 0,
        refetchInterval: 15000, // Fallback poll every 15s if WS misses an event
    });
};

export const useCreateServiceRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newRequest: CreateServiceRequestDTO) => {
            const { data } = await api.post<ServiceRequest>('/services/requests/', newRequest);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
        }
    });
};

export const useAcceptService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestId: number) => {
            const { data } = await api.post<ServiceRequest>(`/services/requests/${requestId}/accept/`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
            queryClient.invalidateQueries({ queryKey: ['service-notifications'] });
        }
    });
};
export const useGetServiceDetail = (id: number) => {
    return useQuery({
        queryKey: ['service-requests', id],
        queryFn: async () => {
            const { data } = await api.get<ServiceRequest>(`/services/requests/${id}/`);
            return data;
        },
        enabled: !!id,
    });
};

export const useStartService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await api.post<ServiceRequest>(`/services/requests/${id}/start/`);
            return data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
            queryClient.invalidateQueries({ queryKey: ['service-requests', id] });
        }
    });
};

export const useCompleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await api.post<ServiceRequest>(`/services/requests/${id}/complete/`);
            return data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
            queryClient.invalidateQueries({ queryKey: ['service-requests', id] });
            queryClient.invalidateQueries({ queryKey: ['service-history'] });
        }
    });
};

export const useCancelService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await api.post<ServiceRequest>(`/services/requests/${id}/cancel/`);
            return data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
            queryClient.invalidateQueries({ queryKey: ['service-requests', id] });
            queryClient.invalidateQueries({ queryKey: ['service-history'] });
        }
    });
};

export const useRescheduleService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, scheduled_at }: { id: number; scheduled_at: string }) => {
            const { data } = await api.post<ServiceRequest>(`/services/requests/${id}/reschedule/`, { scheduled_at });
            return data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
            queryClient.invalidateQueries({ queryKey: ['service-requests', id] });
        }
    });
};

export const useRateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, rating, comment }: { id: number; rating: number; comment: string }) => {
            const { data } = await api.post(`/services/requests/${id}/rate/`, { rating, comment });
            return data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
            queryClient.invalidateQueries({ queryKey: ['service-requests', id] });
        }
    });
};
export const useServiceNotifications = () => {
    return useQuery({
        queryKey: ['service-notifications'],
        queryFn: async () => {
            const { data } = await api.get<ServiceRequestNotification[]>('/services/notifications/');
            return data;
        },
        refetchInterval: 15000,
    });
};

export const useRejectService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
            const { data } = await api.post(`/services/requests/${id}/reject/`, { reason });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
        }
    });
};

export interface ServiceHistoryFilters {
    start_date?: string;
    end_date?: string;
    category?: number;
    worker_id?: number;
}

export function useServiceHistory(filters?: ServiceHistoryFilters) {
    return useQuery({
        queryKey: ['service-history', filters],
        queryFn: () => {
            const params = new URLSearchParams();
            params.append('status', 'COMPLETED');
            params.append('status', 'CANCELLED');
            if (filters?.start_date) params.set('start_date', filters.start_date);
            if (filters?.end_date) params.set('end_date', filters.end_date);
            if (filters?.category) params.set('category', String(filters.category));
            if (filters?.worker_id) params.set('worker_id', String(filters.worker_id));
            return api.get<ServiceRequest[]>(`/services/requests/?${params.toString()}`).then(r => r.data);
        },
        staleTime: 0,
    });
}

