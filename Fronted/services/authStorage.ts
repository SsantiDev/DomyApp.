import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export const saveTokens = async (tokens: { access: string; refresh: string }) => {
    try {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.access);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh);
    } catch (error) {
        console.error('Error saving tokens:', error);
        throw error;
    }
};

export const getAccessToken = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
};

export const getRefreshToken = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
};

export const removeTokens = async () => {
    try {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error removing tokens:', error);
        throw error;
    }
};
