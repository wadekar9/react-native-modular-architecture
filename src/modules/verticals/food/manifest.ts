import type { ModuleManifest } from '@modules/module.types';
import { EFoodStackScreens } from './constants/screens.constants';
import store, { injectReducer } from '@core/store/redux.store';
import { cartReducer, clearCart } from './store/cart.slice';
import { foodOrdersReducer, clearFoodOrders, setFoodOrders } from './store/orders.slice';
import { clearPersistedCart, persistCart } from './store/cart.persistence';
import { clearPersistedFoodOrders, loadPersistedFoodOrders } from './store/orders.persistence';
import { offlineSync } from '@core/database';
import type { CartState } from './types/cart.types';
import { registerFoodTranslations } from './i18n';

let stopCartPersistence: (() => void) | undefined;
let stopOrderSyncHandler: (() => void) | undefined;

/**
 * ============================================================================
 * FOOD VERTICAL MANIFEST
 * ============================================================================
 */
const foodManifest: ModuleManifest = {
  id: 'food',
  title: 'Food',

  /**
   * Lifecycle hook triggered when the module is activated.
   * Injects the dynamic 'cart' and 'foodOrders' reducer slices into the root Redux store
   * and hydrates persisted local database orders.
   */
  onRegister: () => {
    registerFoodTranslations();
    injectReducer('cart', cartReducer);
    injectReducer('foodOrders', foodOrdersReducer);

    // Hydrate offline orders from local database into Redux store
    const persistedOrders = loadPersistedFoodOrders();
    if (persistedOrders.length > 0) {
      store.dispatch(setFoodOrders(persistedOrders));
    }

    // Register offline outbox synchronization handler for food orders
    if (!stopOrderSyncHandler) {
      stopOrderSyncHandler = offlineSync.registerHandler('food_order', async mutation => {
        // Here the mutation payload is synchronized with remote REST endpoint when connection is alive
        return true;
      });
    }

    if (!stopCartPersistence) {
      let previousCart = (store.getState() as ReturnType<typeof store.getState> & { cart?: CartState }).cart;
      stopCartPersistence = store.subscribe(() => {
        const cart = (store.getState() as ReturnType<typeof store.getState> & { cart?: CartState }).cart;
        if (cart && cart !== previousCart) {
          previousCart = cart;
          persistCart(cart);
        }
      });
    }
  },

  /**
   * Lazy factory returning the root navigation stack of the Food vertical.
   */
  getNavigator: () => require('./navigation/food.stack').default,

  /**
   * Deep linking URL schema for the Food vertical.
   */
  deepLinks: {
    screens: {
      [EFoodStackScreens.RECIPE_DETAILS]: 'food/recipe/:recipeId',
      [EFoodStackScreens.FOOD_SEARCH]: 'food/search',
      [EFoodStackScreens.FOOD_CART]: 'food/cart',
      [EFoodStackScreens.ORDER_DETAILS]: 'food/orders/:orderId',
    },
  },

  /**
   * Lifecycle hook triggered upon user logout to reset Food domain state.
   */
  onLogout: () => {
    store.dispatch(clearCart());
    store.dispatch(clearFoodOrders());
    clearPersistedCart();
    clearPersistedFoodOrders();
  },
};

export default foodManifest;