const getBackendUrl = () => {
    if (!__DEV__) {
        return 'https://domyapp.onrender.com';
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const autoIp = require('./auto-ip.json');
        return `http://${autoIp.localIp || 'localhost'}:8000`;
    } catch {
        return 'http://localhost:8000';
    }
};

export const API_URL = getBackendUrl();
