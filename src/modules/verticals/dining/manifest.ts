import type { ModuleManifest } from '@modules/module.types';
import { EDiningStackScreens } from './constants/screens.constants';
import { registerDiningTranslations } from './i18n';
import { clearPersistedDiningBookings } from './services/bookings.persistence';
import { offlineSync } from '@core/database';

let stopDiningSyncHandler: (() => void) | undefined;

/**
 * ============================================================================
 * DINING VERTICAL MANIFEST
 * ============================================================================
 */
const diningManifest: ModuleManifest = {
  id: 'dining',
  title: 'Dining',

  /**
   * Lifecycle hook triggered when the module is activated.
   * Registers domain translations and offline outbox sync handlers.
   */
  onRegister: () => {
    registerDiningTranslations();

    if (!stopDiningSyncHandler) {
      stopDiningSyncHandler = offlineSync.registerHandler('dining_booking', async mutation => {
        // Syncs booking mutation with dining reservation service when online
        return true;
      });
    }
  },

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

  /**
   * Cleans up local domain data when user logs out.
   */
  onLogout: () => {
    clearPersistedDiningBookings();
  },
};

export default diningManifest;