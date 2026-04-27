import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { UserAddress, CreateUserAddressDTO } from '../types/user';

export const useAddresses = () => {
    return useQuery({
        queryKey: ['addresses'],
        queryFn: async () => {
            const { data } = await api.get<UserAddress[]>('/users/addresses/');
            return data;
        },
    });
};

export const useCreateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dto: CreateUserAddressDTO) => {
            const { data } = await api.post<UserAddress>('/users/addresses/', dto);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...dto }: Partial<CreateUserAddressDTO> & { id: number }) => {
            const { data } = await api.patch<UserAddress>(`/users/addresses/${id}/`, dto);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/users/addresses/${id}/`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
    });
};
