export const LIGHT_COLORS = {
    primary: '#667eea',
    primaryDark: '#5a67d8',
    secondary: '#718096',
    success: '#48bb78',
    danger: '#f56565',
    warning: '#ed8936',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1a202c',
    textLight: '#4a5568',
    textMuted: '#a0aec0',
    border: '#edf2f7',
    categoryBg: '#f0f4ff',
    white: '#ffffff',
};

export const DARK_COLORS = {
    primary: '#7c8ef2',
    primaryDark: '#667eea',
    secondary: '#a0aec0',
    success: '#68d391',
    danger: '#fc8181',
    warning: '#f6ad55',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textLight: '#cbd5e0',
    textMuted: '#718096',
    border: '#2d3748',
    categoryBg: '#1e1e3f',
    white: '#ffffff',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
};

export const RADIUS = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const TYPOGRAPHY: { [key: string]: any } = {
    h1: { fontSize: 28, fontWeight: 'bold' as const },
    h2: { fontSize: 24, fontWeight: 'bold' as const },
    h3: { fontSize: 18, fontWeight: 'bold' as const },
    body: { fontSize: 16 },
    caption: { fontSize: 14 },
    small: { fontSize: 12 },
};

export type ThemeColors = typeof LIGHT_COLORS;
