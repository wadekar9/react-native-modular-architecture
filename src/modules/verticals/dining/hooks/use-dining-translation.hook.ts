import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { registerDiningTranslations } from '../i18n';

registerDiningTranslations();

export const useDiningTranslation = () => {
  const { t, i18n } = useTranslation('dining' as any);
  const dining_t = useCallback((key: string, options?: Record<string, any>): string => (t as any)(key, options) as string, [t]);

  return {
    t,
    i18n,
    dining_t,
  };
};

