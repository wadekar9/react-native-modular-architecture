import i18n from '@core/i18n/i18n';
import { changeAppLanguage, LANGUAGE_STORAGE_KEY } from '@core/i18n';
import { Storage } from '@core/storage';

describe('app language and multi-language support', () => {
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

  it('translates navigation keys across en, es, and hi', async () => {
    await changeAppLanguage('en');
    expect(i18n.i18n.t('navigation:FOOD')).toBe('Food');
    expect(i18n.i18n.t('navigation:DINING')).toBe('Dining');

    await changeAppLanguage('es');
    expect(i18n.i18n.t('navigation:FOOD')).toBe('Comida');
    expect(i18n.i18n.t('navigation:DINING')).toBe('Restaurantes');

    await changeAppLanguage('hi');
    expect(i18n.i18n.t('navigation:FOOD')).toBe('खाना');
    expect(i18n.i18n.t('navigation:DINING')).toBe('रेस्तरां');
  });

  it('translates food vertical keys across en, es, and hi', async () => {
    await changeAppLanguage('en');
    expect(i18n.i18n.t('food:TITLE')).toBe('Cook something good.');
    expect(i18n.i18n.t('food:BROWSE_RECIPES')).toBe('Browse recipes');

    await changeAppLanguage('es');
    expect(i18n.i18n.t('food:TITLE')).toBe('Cocina algo delicioso.');
    expect(i18n.i18n.t('food:BROWSE_RECIPES')).toBe('Explorar recetas');

    await changeAppLanguage('hi');
    expect(i18n.i18n.t('food:TITLE')).toBe('कुछ बढ़िया पकाएं।');
    expect(i18n.i18n.t('food:BROWSE_RECIPES')).toBe('रेसिपी ब्राउज़ करें');
  });

  it('translates dining vertical keys across en, es, and hi', async () => {
    await changeAppLanguage('en');
    expect(i18n.i18n.t('dining:TITLE')).toBe('Dining events');
    expect(i18n.i18n.t('dining:EXPLORE_TITLE')).toBe('Explore');

    await changeAppLanguage('es');
    expect(i18n.i18n.t('dining:TITLE')).toBe('Eventos gastronómicos');
    expect(i18n.i18n.t('dining:EXPLORE_TITLE')).toBe('Explorar');

    await changeAppLanguage('hi');
    expect(i18n.i18n.t('dining:TITLE')).toBe('भोजन कार्यक्रम');
    expect(i18n.i18n.t('dining:EXPLORE_TITLE')).toBe('खोजें');
  });
});