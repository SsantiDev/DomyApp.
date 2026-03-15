import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../services/userService';
import { ClientProfile, WorkerProfile, UserRole } from '../types/auth';

export const PROFILE_QUERY_KEY = ['profile'];

export const useGetProfile = () => {
    return useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: getProfile,
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data, role }: { data: Partial<ClientProfile | WorkerProfile>, role: UserRole }) =>
            updateProfile(data, role),
        onSuccess: (updatedUser) => {
            // Refresh the cached profile with the response
            queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser);
        },
    });
};
