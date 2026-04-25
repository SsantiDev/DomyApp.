import { useEffect, useRef, useCallback, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface RealTimeEvent {
  type: 'CHAT' | 'STATUS_CHANGE' | 'SYSTEM_ALERT' | 'MARK_READ';
  payload: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url: string;
  onMessage: (event: RealTimeEvent) => void;
  enabled: boolean;
}

const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;
const MAX_RETRIES = 10;

export function useWebSocket({ url, onMessage, enabled }: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<RealTimeEvent | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    clearRetryTimeout();
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.onopen = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, [clearRetryTimeout]);

  const connect = useCallback(() => {
    if (!isMountedRef.current || !enabled) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    disconnect();

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMountedRef.current) return;
      retryCountRef.current = 0;
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      if (!isMountedRef.current) return;
      try {
        const data: RealTimeEvent = JSON.parse(event.data);
        setLastMessage(data);
        onMessageRef.current(data);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = (event) => {
      if (!isMountedRef.current) return;
      setIsConnected(false);
      wsRef.current = null;

      // Don't retry on auth errors
      if (event.code === 4001 || event.code === 4003) return;
      if (!enabled) return;

      if (retryCountRef.current < MAX_RETRIES) {
        const delay = Math.min(
          INITIAL_RETRY_DELAY * Math.pow(2, retryCountRef.current),
          MAX_RETRY_DELAY
        );
        retryCountRef.current += 1;
        retryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && appStateRef.current === 'active') {
            connect();
          }
        }, delay);
      }
    };

    ws.onerror = () => {
      // onclose will fire after onerror, reconnect logic lives there
    };
  }, [url, enabled, disconnect]);

  // AppState lifecycle
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;

      if (nextState === 'active' && prev !== 'active' && enabled) {
        retryCountRef.current = 0;
        connect();
      } else if (nextState === 'background' || nextState === 'inactive') {
        clearRetryTimeout();
        if (wsRef.current) {
          wsRef.current.onclose = null;
          wsRef.current.close();
          wsRef.current = null;
          setIsConnected(false);
        }
      }
    });

    return () => subscription.remove();
  }, [enabled, connect, clearRetryTimeout]);

  // Main connect/disconnect effect
  useEffect(() => {
    isMountedRef.current = true;

    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      isMountedRef.current = false;
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  const sendMessage = useCallback((data: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
}
