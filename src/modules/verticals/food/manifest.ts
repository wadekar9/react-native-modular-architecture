import type { ModuleManifest } from '@modules/module.types';
import { EFoodStackScreens } from './constants/screens.constants';
import store, { injectReducer } from '@core/store/redux.store';
import { cartReducer, clearCart } from './store/cart.slice';
import { foodOrdersReducer, clearFoodOrders } from './store/orders.slice';

/**
 * ============================================================================
 * FOOD VERTICAL MANIFEST
 * ============================================================================
 *
 * This manifest is the ONLY file exported by the Food vertical to the outside app.
 * It serves as an isolated bridge between the Food vertical and the host shell.
 *
 * KEY INTERNAL ARCHITECTURAL PATTERNS DEMONSTRATED HERE:
 *
 * 1. ZERO DIRECT VERTICAL IMPORTS BY CORE:
 *    Neither `RootNavigator` nor `rootReducer` directly import Food screens or slices.
 *    Everything is declared declaratively inside this manifest object.
 *
 * 2. DYNAMIC REDUX REDUCER INJECTION (`onRegister`):
 *    The core Redux store does not have `cart` baked in at compile time.
 *    When `getActiveVerticals()` runs and detects that the Food vertical is enabled,
 *    it calls `onRegister()`. We then call `injectReducer('cart', cartReducer)` which
 *    uses `store.replaceReducer()` to dynamically attach the cart slice to the root store.
 *    If the Food vertical is removed or disabled, `cart` slice never exists in memory!
 *
 * 3. LAZY EVALUATION & CODE SPLITTING (`getNavigator`):
 *    Using `() => require('./navigation/food.stack').default` defers importing the Food
 *    stack, screens, assets, and child components until React Navigation renders the Food tab.
 *    This drastically minimizes initial bundle evaluation and reduces Time-to-Interactive (TTI).
 *
 * 4. DEEP LINKING ENCAPSULATION (`deepLinks`):
 *    Maps external URL paths ('food/recipe/:id', 'food/cart') to internal stack screens
 *    (`EFoodStackScreens.RECIPE_DETAILS`, `EFoodStackScreens.FOOD_CART`).
 *
 * 5. SESSION TEARDOWN (`onLogout`):
 *    When the user signs out, `onLogout()` dispatches `clearCart()` to empty items
 *    and ensure zero sensitive/stale cart data persists across user sessions.
 */
const foodManifest: ModuleManifest = {
  id: 'food',
  title: 'Food',

  /**
   * Lifecycle hook triggered when the module is activated.
   * Injects the dynamic 'cart' reducer slice into the root Redux store.
   */
  onRegister: () => {
    injectReducer('cart', cartReducer);
    injectReducer('foodOrders', foodOrdersReducer);
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
      [EFoodStackScreens.RECIPE_DETAILS]: 'food/recipe/:id',
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
  },
};

export default foodManifest;