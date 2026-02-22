import api from './api';

export interface TestConnectionResponse {
    ok: boolean;
    message?: string;
}

export const testConnection = async (): Promise<TestConnectionResponse> => {
    try {
        const response = await api.get<TestConnectionResponse>('/test-connection/');
        return response.data;
    } catch (error) {
        console.error('Error in testConnection:', error);
        throw error;
    }
};
