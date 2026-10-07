import i18n from '@core/i18n/i18n';
import { changeAppLanguage, LANGUAGE_STORAGE_KEY } from '@core/i18n';
import { Storage } from '@core/storage';

describe('app language', () => {
  afterEach(async () => {
    await changeAppLanguage('en');
    Storage.delete(LANGUAGE_STORAGE_KEY);
  });

  it.each([
    ['es', 'Idioma'],
    ['hi', 'भाषा'],
  ] as const)('changes to %s and persists the selection', async (language, expectedLabel) => {
    await changeAppLanguage(language);

    expect(i18n.i18n.language).toBe(language);
    expect(Storage.getString(LANGUAGE_STORAGE_KEY)).toBe(language);
    expect(i18n.i18n.t('common:LANGUAGE')).toBe(expectedLabel);
  });
});