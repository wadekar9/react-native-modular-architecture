import { resources, defaultNS } from '@core/i18n';
import type foodEn from '@modules/verticals/food/i18n/locales/en.json';
import type diningEn from '@modules/verticals/dining/i18n/locales/en.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['en'] & {
      food: typeof foodEn;
      dining: typeof diningEn;
    };
  }
}