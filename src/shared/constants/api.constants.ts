/**
 * Centralized API route contracts for SuperApp.
 * Aligns with QuickfixPartner's strongly-typed API_ROUTES pattern.
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/users/add',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },

  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_AS_READ: '/notifications/mark-as-read',
    MARK_ALL_AS_READ: '/notifications/mark-all-as-read',
    CLEAR_ALL: '/notifications/clear-all',
    DELETE: (id: string) => `/notifications/${id}`,
  },

  FOOD: {
    PRODUCTS: '/products',
    CATEGORIES: '/products/categories',
    PRODUCT_DETAILS: (id: string | number) => `/products/${id}`,
  },

  DINING: {
    RESTAURANTS: '/restaurants',
    RESTAURANT_DETAILS: (id: string | number) => `/restaurants/${id}`,
  },
} as const;

