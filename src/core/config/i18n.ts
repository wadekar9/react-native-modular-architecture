import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@shared/locales/en';
import es from '@shared/locales/es';
import hi from '@shared/locales/hi';

export const defaultNS = 'actions';
export const resources = {
    en,
    es,
    hi,
} as const;

i18n.use(initReactI18next).init({
    lng: 'en',
    defaultNS,
    resources,
    interpolation: {
        escapeValue: false,
    },
    compatibilityJSON: 'v4',
});

export default { i18n };
