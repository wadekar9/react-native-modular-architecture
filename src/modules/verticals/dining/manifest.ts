import type { ModuleManifest } from '@modules/module.types';
import { EDiningStackScreens } from './constants/screens.constants';

/**
 * ============================================================================
 * DINING VERTICAL MANIFEST
 * ============================================================================
 *
 * This manifest defines the contract for the Dining & Reservations vertical.
 *
 * KEY ARCHITECTURAL POINTS:
 *
 * 1. INDEPENDENT DOMAIN MODULE:
 *    The Dining vertical is completely unaware of the Food vertical, Chat, or
 *    other siblings. It solely consumes platform APIs and core utilities.
 *
 * 2. OPTIONAL LIFECYCLE HOOKS:
 *    Because Dining currently relies on server-driven queries (TanStack Query)
 *    rather than custom Redux slices, it does not declare `onRegister` or `onLogout`.
 *    Verticals only implement the lifecycle hooks they actually need.
 *
 * 3. LAZY NAVIGATION LOADER:
 *    The `dining.stack` navigator is loaded on-demand via `require()` only when
 *    the user taps the "Dining" tab, keeping the main app startup snappy.
 *
 * 4. DEEP LINKING:
 *    Allows opening dining events directly via deep links (`dining/event/:id`).
 */
const diningManifest: ModuleManifest = {
  id: 'dining',
  title: 'Dining',

  /**
   * Lazy factory returning the root navigation stack of the Dining vertical.
   */
  getNavigator: () => require('./navigation/dining.stack').default,

  /**
   * Deep linking URL schema for the Dining vertical.
   */
  deepLinks: {
    screens: {
      [EDiningStackScreens.EVENT_DETAILS]: 'dining/event/:eventId',
      [EDiningStackScreens.EVENT_BOOKING]: 'dining/event/:eventId/book',
    },
  },
};

export default diningManifest;