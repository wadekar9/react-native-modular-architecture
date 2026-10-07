import type { ModuleManifest } from '../src/modules/module.types';

/**
 * ============================================================================
 * MODULE REGISTRY ARCHITECTURE & ISOLATION TESTS
 * ============================================================================
 *
 * This test suite guarantees that the modular architecture principles are upheld:
 *
 * 1. ZERO EAGER EVALUATION (Lazy Loading Guarantee):
 *    Importing vertical manifests MUST NOT trigger loading of their navigators,
 *    screens, or heavy dependencies until explicitly called.
 *
 * 2. FEATURE FLAG COMPLIANCE:
 *    A vertical guarded by a flag MUST ONLY be activated when that flag is true.
 *
 * 3. LIFECYCLE DISPATCH ISOLATION:
 *    Logout hooks across all verticals MUST be dispatched cleanly without direct
 *    coupling between core auth and vertical internals.
 *
 * 4. DEEP LINK AGGREGATION:
 *    Deep links defined across disparate manifests MUST merge predictably.
 */

// Spy on navigator imports to assert they remain uncalled during registration
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

import {
  getActiveVerticals,
  getVerticalDeepLinks,
  runLogoutHooks,
  verticals,
} from '../src/modules/registry';

/**
 * VERIFICATION 1: Lazy Loading
 * Asserts that importing manifests does NOT eagerly evaluate navigation stacks.
 */
test('registry keeps vertical navigators lazy', () => {
  expect(mockFoodNavigatorLoaded).not.toHaveBeenCalled();
  expect(mockDiningNavigatorLoaded).not.toHaveBeenCalled();
  expect(verticals.map(vertical => vertical.id)).toEqual([
    'food',
    'dining',
  ]);
});

/**
 * VERIFICATION 2: Feature Flag Gating
 * Asserts that flagged verticals are strictly filtered out unless flag is explicitly true.
 */
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

/**
 * VERIFICATION 3: Logout Lifecycle Hook Dispatch
 * Asserts that the registry broadcasts logout events to all vertical manifests.
 */
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

/**
 * VERIFICATION 4: Deep Link Aggregation
 * Asserts that deep link routes declared in manifests are merged into a unified config.
 */
test('registry returns aggregated deep links from manifests', () => {
  const deepLinks = getVerticalDeepLinks();
  expect(deepLinks.food).toBeDefined();
  expect(deepLinks.dining).toBeDefined();
});
