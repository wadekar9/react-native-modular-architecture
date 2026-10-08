import type { ComponentType } from 'react';

/**
 * ============================================================================
 * VERTICAL MODULE MANIFEST CONTRACT
 * ============================================================================
 *
 * In this modular SuperApp architecture, a "Vertical" (e.g., Food, Dining,
 * Grocery, Rides) is a completely self-contained business domain feature.
 *
 * To maintain strict decoupling:
 * 1. Verticals NEVER import code directly from sibling verticals.
 * 2. Core and shell navigation NEVER hardcode vertical screen imports or reducers.
 * 3. Each vertical exposes a single contract adhering to `ModuleManifest`.
 *
 * This contract enables:
 * - Dynamic Pluggability: Verticals can be added, removed, or feature-flagged
 *   without editing core navigators or root Redux stores.
 * - Lazy Loading: The vertical's bundle and navigators are only evaluated when
 *   the user actually navigates to the vertical.
 * - Dynamic State Injection: Vertical Redux slices are registered at runtime via
 *   `onRegister`, preventing bloat in the static root reducer.
 * - Lifecycle Management: Clean state teardown on user logout via `onLogout`.
 */
export type ModuleManifest = {
  /**
   * Unique identifier for the vertical module (e.g., 'food', 'dining').
   * Used as the navigation tab route key and identifier in the registry.
   */
  id: string;

  /**
   * Optional feature flag key (matching a flag in `flags.slice.ts` or remote config).
   * If specified, the vertical is only mounted when `flags[flag] === true`.
   * If omitted, the vertical is active by default.
   */
  flag?: string;

  /**
   * Human-readable title displayed in top tab bars, switchers, and headers.
   */
  title: string;

  /**
   * Optional icon identifier or asset name for tab bars and navigation drawers.
   */
  icon?: string;

  /**
   * Lazy navigation component loader.
   *
   * CRITICAL FOR PERFORMANCE:
   * Returns a dynamic `require()` or `import()` function resolving to the root
   * navigator component of the vertical. This ensures that the vertical's entire
   * component tree, screens, and dependencies are NOT loaded into memory during
   * initial application boot.
   *
   * Example:
   * ```ts
   * getNavigator: () => require('./navigation/food.stack').default
   * ```
   */
  getNavigator: () => ComponentType;

  /**
   * Deep linking route mapping for React Navigation linking configuration.
   * Aggregated by the module registry to build root URL deep link handlers.
   *
   * Example:
   * ```ts
   * deepLinks: {
   *   screens: {
   *     RecipeDetails: 'food/recipe/:id',
   *     FoodCart: 'food/cart',
   *   }
   * }
   * ```
   */
  deepLinks?: Record<string, any>;

  /**
   * Lifecycle Hook: Executed when the vertical is registered as active.
   *
   * Primarily used for Dynamic Redux Reducer Injection:
   * The vertical dynamically injects its own slices into the Redux store
   * via `injectReducer('cart', cartReducer)` so the core store remains lean.
   */
  onRegister?: () => void;

  /**
   * Lifecycle Hook: Executed when the user logs out of the application.
   *
   * Verticals clean up their specific persisted data, empty carts, clear
   * cache, and reset internal states to prevent data leakage between sessions.
   */
  onLogout?: () => void;
};

/**
 * ============================================================================
 * PLATFORM MODULE MANIFEST CONTRACT
 * ============================================================================
 *
 * Defines the contract for core cross-cutting platform capability modules
 * (e.g. auth, location, notifications, settings).
 */
export type PlatformScreenEntry = {
  name: string;
  getComponent: () => ComponentType<any>;
  options?: Record<string, any>;
};

export type PlatformModuleManifest = {
  id: string;
  title?: string;
  screens: PlatformScreenEntry[];
  onRegister?: () => void;
  onLogout?: () => void;
};