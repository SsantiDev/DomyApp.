import Constants from 'expo-constants';
import autoIp from './auto-ip.json';

const getBackendUrl = () => {
    // En producción (cuando no es __DEV__), usamos siempre el backend en Render
    if (!__DEV__) {
        return 'https://domyapp.onrender.com';
    }

    // En desarrollo, usamos la IP detectada automáticamente por el script
    const localIp = autoIp.localIp || 'localhost';

    return `http://${localIp}:8000`;
};

export const API_URL = getBackendUrl();
