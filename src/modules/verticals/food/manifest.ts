import type { ModuleManifest } from '@modules/module.types';
import { EFoodStackScreens } from './constants/screens.constants';
import store, { injectReducer } from '@core/store/redux.store';
import { cartReducer, clearCart } from './store/cart.slice';

const foodManifest: ModuleManifest = {
  id: 'food',
  title: 'Food',
  onRegister: () => {
    // Dynamically register vertical slice to Redux store when active
    injectReducer('cart', cartReducer);
  },
  getNavigator: () => require('./navigation/food.stack').default,
  deepLinks: {
    screens: {
      [EFoodStackScreens.RECIPE_DETAILS]: 'food/recipe/:id',
      [EFoodStackScreens.FOOD_CART]: 'food/cart',
    },
  },
  onLogout: () => {
    store.dispatch(clearCart());
  },
};

export default foodManifest;