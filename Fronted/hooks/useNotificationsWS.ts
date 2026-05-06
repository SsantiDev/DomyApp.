import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket, RealTimeEvent } from './useWebSocket';
import { API_URL } from '../config/envConfig';
import { ADMIN_SERVICES_KEY, ADMIN_INCIDENTS_KEY } from './useAdmin';

interface UseNotificationsWSOptions {
  token: string | null;
  enabled: boolean;
}

// Derive WS base URL from API_URL: replace http(s) scheme with ws(s)
const WS_HOST = API_URL.replace(/^http/, 'ws');

export function useNotificationsWS({ token, enabled }: UseNotificationsWSOptions) {
  const queryClient = useQueryClient();

  const handleMessage = useCallback((event: RealTimeEvent) => {
    if (event.type === 'STATUS_CHANGE') {
      // Status change triggered by worker action – refresh client and worker views
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['service-notifications'] });
    } else if (event.type === 'SYSTEM_ALERT') {
      // New service request broadcast – refresh worker notification queue and admin views
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['service-notifications'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_SERVICES_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_INCIDENTS_KEY });
    }
  }, [queryClient]);

  const wsUrl = token ? `${WS_HOST}/ws/notifications/?token=${token}` : '';

  const { isConnected } = useWebSocket({
    url: wsUrl,
    onMessage: handleMessage,
    enabled: enabled && !!token,
  });

  return { isConnected };
}
