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
