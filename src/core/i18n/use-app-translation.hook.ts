import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useAppTranslation = (ns?: any) => {
  const { t, i18n } = useTranslation(ns);

  const messages_t = useCallback((key: string, options?: any): string => t(`messages:${key}` as any, options) as string, [t]);
  const common_t = useCallback((key: string, options?: any): string => t(`common:${key}` as any, options) as string, [t]);
  const actions_t = useCallback((key: string, options?: any): string => t(`actions:${key}` as any, options) as string, [t]);
  const auth_t = useCallback((key: string, options?: any): string => t(`auth:${key}` as any, options) as string, [t]);
  const nav_t = useCallback((key: string, options?: any): string => t(`navigation:${key}` as any, options) as string, [t]);
  const scoped_t = useCallback((key: string, options?: any): string => (t as any)(key, options) as string, [t]);

  return {
    t,
    i18n,
    messages_t,
    common_t,
    actions_t,
    auth_t,
    nav_t,
    scoped_t,
  };
};
