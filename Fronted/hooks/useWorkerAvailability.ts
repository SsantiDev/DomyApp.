import { useState, useCallback } from 'react';
import { toggleAvailability } from '../services/workerService';
import { useAuth } from '../context/AuthContext';

export function useWorkerAvailability() {
    const { user } = useAuth();
    const [isAvailable, setIsAvailable] = useState(user?.profile?.is_available || false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await toggleAvailability();
            setIsAvailable(data.is_available);
            return data.is_available;
        } catch (err: any) {
            const msg = err?.message || 'Error al cambiar disponibilidad';
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        isAvailable,
        loading,
        error,
        handleToggle,
    };
}
