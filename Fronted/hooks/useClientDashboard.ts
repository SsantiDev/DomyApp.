import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useServiceRequests, useCategories } from './useServices';

export const useClientDashboard = () => {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { data: requests, isLoading: loadingRequests } = useServiceRequests();
    const { data: categories, isLoading: loadingCats } = useCategories();

    const activeRequest = useMemo(() =>
        requests?.find(r => r.status === 'PENDING' || r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS'),
        [requests]);

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
        activeRequest,
        completedRequests,
        categories,
        navigateToDetail,
        toggleModal
    };
};
