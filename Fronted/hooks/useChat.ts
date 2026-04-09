import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Message, SendMessageDTO } from '../types/chat';

export const CHAT_QUERY_KEY = 'chat-messages';

/**
 * Hook to fetch messages for a specific service using long-polling
 */
export const useChatMessages = (serviceId: number, isSupport: boolean) => {
    return useQuery({
        queryKey: [CHAT_QUERY_KEY, serviceId, isSupport],
        queryFn: async () => {
            const { data } = await api.get('/chat/messages/', {
                params: {
                    service_request: serviceId,
                    is_support_chat: isSupport,
                }
            });
            // Django DRF paginates sometimes, adjust based on standard response
            return (data as any).results ? (data as any).results as Message[] : data as Message[];
        },
        refetchInterval: 3000, // Long-polling: Refetch every 3 seconds
        enabled: !!serviceId,
    });
};

/**
 * Hook to send a new message
 */
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SendMessageDTO) => {
            const { data } = await api.post<Message>('/chat/messages/', payload);
            return data;
        },
        onSuccess: (newMessage) => {
            // Optimistically update or just invalidate to trigger refetch
            queryClient.invalidateQueries({
                queryKey: [CHAT_QUERY_KEY, newMessage.service_request, newMessage.is_support_chat]
            });
        }
    });
};
