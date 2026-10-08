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
    setFoodOrders: (state, action: PayloadAction<FoodOrder[]>) => {
      state.orders = action.payload;
    },
    addFoodOrder: (state, action: PayloadAction<FoodOrder>) => {
      state.orders.unshift(action.payload);
    },
    clearFoodOrders: () => initialState,
  },
});

export const { setFoodOrders, addFoodOrder, clearFoodOrders } = ordersSlice.actions;
export const foodOrdersReducer = ordersSlice.reducer;