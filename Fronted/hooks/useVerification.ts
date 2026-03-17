import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitVerification, VerificationData } from '../services/verificationService';
import { PROFILE_QUERY_KEY } from './useProfile';

export const useSubmitVerification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: VerificationData) => submitVerification(data),
        onSuccess: (data) => {
            // After submitting, profile state should change to PENDING.
            // Invalidate profile query to refetch the new status.
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        },
    });
};
