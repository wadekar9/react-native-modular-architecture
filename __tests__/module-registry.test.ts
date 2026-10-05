import type { ModuleManifest } from '../src/modules/module.types';

const mockFoodNavigatorLoaded = jest.fn();
jest.mock('../src/modules/verticals/food/navigation/food.stack', () => {
  mockFoodNavigatorLoaded();
  return { __esModule: true, default: () => null };
});

const mockDiningNavigatorLoaded = jest.fn();
jest.mock('../src/modules/verticals/dining/navigation/dining.stack', () => {
  mockDiningNavigatorLoaded();
  return { __esModule: true, default: () => null };
});

import { getActiveVerticals, runLogoutHooks, verticals } from '../src/modules/registry';

test('registry keeps vertical navigators lazy', () => {
  expect(mockFoodNavigatorLoaded).not.toHaveBeenCalled();
  expect(mockDiningNavigatorLoaded).not.toHaveBeenCalled();
  expect(verticals.map(vertical => vertical.id)).toEqual([
    'food',
    'dining',
  ]);
});

test('flagged verticals are active only when the flag is true', () => {
  const flaggedVertical: ModuleManifest = {
    ...verticals[0],
    id: 'flagged-test',
    flag: 'enabled',
  };
  verticals.push(flaggedVertical);

  try {
    expect(getActiveVerticals({}).some(vertical => vertical.id === 'flagged-test')).toBe(false);
    expect(getActiveVerticals({ enabled: false }).some(vertical => vertical.id === 'flagged-test')).toBe(false);
    expect(getActiveVerticals({ enabled: true }).some(vertical => vertical.id === 'flagged-test')).toBe(true);
  } finally {
    verticals.pop();
  }
});

test('registry runs logout hooks', () => {
  const onLogout = jest.fn();
  verticals.push({ ...verticals[0], id: 'logout-test', onLogout });

  try {
    runLogoutHooks();
    expect(onLogout).toHaveBeenCalledTimes(1);
  } finally {
    verticals.pop();
  }
});
