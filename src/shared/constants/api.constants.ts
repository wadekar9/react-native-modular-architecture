import Config from 'react-native-config';

export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        LOG_OUT: '/auth/logout',
    },
    PRODUCTS: {
        LIST: '/products',
        CATEGORIES: '/products/categories',
    },
} as const;

export const API_URL = Config.BASE_URL || 'https://dummyjson.com';