export const LANGUAGE_STORAGE_KEY = '@app.language';
export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'es', label: 'Spanish', nativeName: 'Español' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]['code'];

