import type { ModuleManifest } from './module.types';
import diningManifest from './verticals/dining/manifest';
import foodManifest from './verticals/food/manifest';

/**
 * ============================================================================
 * CENTRAL VERTICAL MODULE REGISTRY
 * ============================================================================
 *
 * This file serves as the Single Source of Truth and discovery hub for all
 * business verticals in the SuperApp.
 *
 * HOW IT WORKS INTERNALLY:
 * 1. REGISTRATION:
 *    Each vertical is imported purely as its lightweight `manifest` object.
 *    No screens, heavy components, or navigation stacks are loaded here.
 *    To add a new vertical (e.g. 'grocery'), a developer only needs to create
 *    its folder under `src/modules/verticals/grocery/manifest.ts` and add it here.
 *    To delete a vertical, simply remove its manifest from the `verticals` array.
 *
 * 2. FEATURE FLAG FILTERING & LIFECYCLE DISPATCH:
 *    `getActiveVerticals(flags)` compares each vertical's optional `flag` key
 *    against current feature flags stored in Redux (`flags.slice.ts`).
 *    For every active vertical, `onRegister()` is triggered, dynamically injecting
 *    the vertical's Redux reducer slice into the root store on demand.
 *
 * 3. DYNAMIC NAVIGATION GENERATION:
 *    The returned array of active manifests is consumed by `MainNavigator`
 *    (`main-navigator.navigation.tsx`) to dynamically instantiate top tab screens
 *    via `Tabs.Screen getComponent={vertical.getNavigator}`.
 *
 * 4. CENTRALIZED LOGOUT CLEANUP:
 *    `runLogoutHooks()` iterates through all registered verticals and fires their
 *    `onLogout()` handler, ensuring private carts, drafts, and caches are cleared.
 */

/**
 * Array of all registered vertical manifests in the SuperApp.
 * Add new vertical manifests here to enable them in the application.
 */
export const verticals: ModuleManifest[] = [
  foodManifest,
  diningManifest,
];

/**
 * Evaluates active verticals based on runtime feature flags and executes their
 * `onRegister` lifecycle hooks (such as dynamic Redux reducer injection).
 *
 * @param flags Current feature flag dictionary from Redux `state.flags`
 * @returns Array of enabled `ModuleManifest` instances
 */
export const getActiveVerticals = (flags: Record<string, boolean | undefined>): ModuleManifest[] => {
  const active = verticals.filter(
    vertical => vertical.flag === undefined || flags[vertical.flag] === true
  );

  // Trigger lifecycle registration hooks (e.g., injectReducer) for active verticals
  active.forEach(vertical => vertical.onRegister?.());

  return active;
};

/**
 * Invoked by root authentication flows when the user signs out.
 * Iterates through all registered verticals and invokes their `onLogout` cleanup
 * hooks without coupling the auth flow to any vertical's internal reducers or files.
 */
export const runLogoutHooks = (): void => {
  verticals.forEach(vertical => vertical.onLogout?.());
};

/**
 * Aggregates deep link route hierarchies from each vertical manifest into a single
 * nested config suitable for React Navigation's root linking options.
 *
 * @returns Combined deep linking mapping keyed by vertical ID
 */
export const getVerticalDeepLinks = (): Record<string, any> => {
  const screens: Record<string, any> = {};
  verticals.forEach(vertical => {
    if (vertical.deepLinks) {
      screens[vertical.id] = vertical.deepLinks;
    }
  });
  return screens;
};