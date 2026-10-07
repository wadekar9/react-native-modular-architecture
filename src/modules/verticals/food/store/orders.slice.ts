import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FoodOrder } from '../types/order.types';

export type FoodOrdersState = {
  orders: FoodOrder[];
};

const initialState: FoodOrdersState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'foodOrders',
  initialState,
  reducers: {
    addFoodOrder: (state, action: PayloadAction<FoodOrder>) => {
      state.orders.unshift(action.payload);
    },
    clearFoodOrders: () => initialState,
  },
});

export const { addFoodOrder, clearFoodOrders } = ordersSlice.actions;
export const foodOrdersReducer = ordersSlice.reducer;