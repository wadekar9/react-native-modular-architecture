import type { ApplicationStateType } from '@core/store/redux.store';
import type { CartState } from './cart.slice';
import type { FoodOrdersState } from './orders.slice';

const emptyCart: CartState = { items: [], total: 0, count: 0 };
const emptyOrders: FoodOrdersState = { orders: [] };

export const selectFoodCart = (state: ApplicationStateType): CartState =>
  (state as ApplicationStateType & { cart?: CartState }).cart ?? emptyCart;

export const selectFoodOrders = (state: ApplicationStateType): FoodOrdersState =>
  (state as ApplicationStateType & { foodOrders?: FoodOrdersState }).foodOrders ?? emptyOrders;