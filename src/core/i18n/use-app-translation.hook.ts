import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useAppTranslation = () => {
  const { t, i18n } = useTranslation();

  const messages_t = useCallback((key: string, options?: any): string => t(`messages:${key}`, options) as string, [t]);
  const common_t = useCallback((key: string, options?: any): string => t(`common:${key}`, options) as string, [t]);
  const actions_t = useCallback((key: string, options?: any): string => t(`actions:${key}`, options) as string, [t]);
  const auth_t = useCallback((key: string, options?: any): string => t(`auth:${key}`, options) as string, [t]);
  const nav_t = useCallback((key: string, options?: any): string => t(`navigation:${key}`, options) as string, [t]);
  const food_t = useCallback((key: string, options?: any): string => t(`food:${key}`, options) as string, [t]);
  const dining_t = useCallback((key: string, options?: any): string => t(`dining:${key}`, options) as string, [t]);

  return {
    t,
    i18n,
    messages_t,
    common_t,
    actions_t,
    auth_t,
    nav_t,
    food_t,
    dining_t,
  };
};
