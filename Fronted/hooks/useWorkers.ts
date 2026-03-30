import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { WorkerPaginationResponse } from '../types/user';

interface WorkerFilters {
    city?: string;
    is_available?: boolean;
    min_rating?: number;
    search?: string;
    page?: number;
}

export const useWorkers = (filters: WorkerFilters = {}) => {
    return useQuery({
        queryKey: ['workers', filters],
        queryFn: async () => {
            const { data } = await api.get<WorkerPaginationResponse>('/users/workers/', {
                params: {
                    ...filters,
                    // Convert boolean to string for backend compatibility if needed, 
                    // though axios usually handles this.
                    is_available: filters.is_available !== undefined ? String(filters.is_available) : undefined
                }
            });
            return data;
        }
    });
};
