import api from './api';

export const toggleAvailability = async () => {
    const response = await api.post('users/profile/toggle-availability/');
    return response.data;
};
