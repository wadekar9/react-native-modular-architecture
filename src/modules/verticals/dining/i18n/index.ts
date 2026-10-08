import en from './locales/en.json';
import es from './locales/es.json';
import hi from './locales/hi.json';
import { registerTranslationBundle } from '@core/i18n';

export const diningTranslations = {
  en,
  es,
  hi,
};

export const registerDiningTranslations = (): void => {
  registerTranslationBundle('dining', diningTranslations);
};

