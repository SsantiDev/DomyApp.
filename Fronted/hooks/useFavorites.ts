import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { FavoriteWorker } from '../types/user';

export const useFavorites = () => {
    return useQuery({
        queryKey: ['favorites'],
        queryFn: async () => {
            const { data } = await api.get<FavoriteWorker[]>('/users/favorites/');
            return data;
        },
    });
};

export const useAddFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (worker_id: number) => {
            const { data } = await api.post<FavoriteWorker>('/users/favorites/', { worker_id });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    });
};

export const useRemoveFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/users/favorites/${id}/`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    });
};
