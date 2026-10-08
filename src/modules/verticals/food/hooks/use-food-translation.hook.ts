import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { registerFoodTranslations } from '../i18n';

registerFoodTranslations();

export const useFoodTranslation = () => {
  const { t, i18n } = useTranslation('food' as any);
  const food_t = useCallback((key: string, options?: Record<string, any>): string => (t as any)(key, options) as string, [t]);

  return {
    t,
    i18n,
    food_t,
  };
};

