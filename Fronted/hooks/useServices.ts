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
        staleTime: 0,           // Always fetch fresh data on mount
        refetchInterval: 10000, // Poll every 10 seconds to reflect status changes from worker
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
        refetchInterval: 15000, // Poll every 15 seconds for new requests
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

