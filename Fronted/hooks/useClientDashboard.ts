import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useServiceRequests, useCategories } from './useServices';

export const useClientDashboard = () => {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { data: requests, isLoading: loadingRequests } = useServiceRequests();
    const { data: categories, isLoading: loadingCats } = useCategories();

    const activeRequests = useMemo(() => {
        if (!requests) return [];
        const statusPriority: Record<string, number> = { 'IN_PROGRESS': 0, 'ACCEPTED': 1, 'PENDING': 2 };
        return requests
            .filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS')
            .sort((a, b) => {
                const pa = statusPriority[a.status ?? ''] ?? 3;
                const pb = statusPriority[b.status ?? ''] ?? 3;
                return pa !== pb ? pa - pb : (b.id ?? 0) - (a.id ?? 0);
            });
    }, [requests]);

    const completedRequests = useMemo(() =>
        requests?.filter(r => r.status === 'COMPLETED').slice(0, 3) || [],
        [requests]);

    const navigateToDetail = (id: string | number | undefined) => {
        if (id !== undefined) {
            router.push(`/service-detail/${id}`);
        }
    };

    const toggleModal = (visible: boolean) => {
        setIsModalVisible(visible);
    };

    return {
        isModalVisible,
        isLoading: loadingRequests || loadingCats,
        activeRequests,
        completedRequests,
        categories,
        navigateToDetail,
        toggleModal
    };
};
