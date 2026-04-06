import { useState, useCallback, useRef } from 'react';
import { toggleAvailability } from '../services/workerService';
import { useAuth } from '../context/AuthContext';

export function useWorkerAvailability() {
    const { user, updateUser } = useAuth();
    const [isAvailable, setIsAvailable] = useState(user?.worker_info?.is_available ?? user?.profile?.is_available ?? false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Prevent race condition: block new toggle while one is in-flight
    const requestInFlight = useRef(false);

    const handleToggle = useCallback(async () => {
        if (requestInFlight.current) return;

        requestInFlight.current = true;
        setError(null);

        // Optimistic update: flip state immediately before awaiting the API
        const previousValue = isAvailable;
        const optimisticValue = !previousValue;
        setIsAvailable(optimisticValue);
        setLoading(true);

        try {
            const data = await toggleAvailability();
            // Confirm with the real value returned by the server
            setIsAvailable(data.is_available);
            // Sync AuthContext so the value persists across navigation
            if (updateUser) {
                updateUser({ 
                    worker_info: { ...user?.worker_info, is_available: data.is_available } 
                });
            }
            return data.is_available;
        } catch (err: any) {
            // Rollback on failure
            setIsAvailable(previousValue);
            const msg = err?.message || 'Error al cambiar disponibilidad';
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
            requestInFlight.current = false;
        }
    }, [isAvailable, updateUser, user?.profile]);

    return {
        isAvailable,
        loading,
        error,
        handleToggle,
    };
}
