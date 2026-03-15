import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Incident } from '../types/support';

export const useReportIncident = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { service_request: number; incident_type: string; description: string }) => {
            const response = await api.post('support/incidents/', data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['service-incidents', variables.service_request] });
        },
    });
};

export const useGetServiceIncidents = (serviceId: number) => {
    return useQuery<Incident[]>({
        queryKey: ['service-incidents', serviceId],
        queryKeyHashFn: (queryKey) => JSON.stringify(queryKey),
        queryFn: async () => {
            const response = await api.get('support/incidents/', {
                params: { service_request: serviceId }
            });
            return response.data;
        },
        enabled: !!serviceId,
    });
};
