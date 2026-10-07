import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import es from './locales/es';
import hi from './locales/hi';
import { Storage } from '../storage';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, SupportedLanguage } from './i18n.constants';

export const defaultNS = 'actions';
export const resources = {
    en,
    es,
    hi,
} as const;

const storedLanguage = Storage.getString(LANGUAGE_STORAGE_KEY);
const initialLanguage = SUPPORTED_LANGUAGES.some(language => language.code === storedLanguage)
    ? storedLanguage as SupportedLanguage
    : DEFAULT_LANGUAGE;

i18n.use(initReactI18next).init({
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map(language => language.code),
    defaultNS,
    resources,
    interpolation: {
        escapeValue: false,
    },
    compatibilityJSON: 'v4',
});

export const changeAppLanguage = async (language: SupportedLanguage): Promise<void> => {
    Storage.set(LANGUAGE_STORAGE_KEY, language);
    await i18n.changeLanguage(language);
};

export default { i18n };
