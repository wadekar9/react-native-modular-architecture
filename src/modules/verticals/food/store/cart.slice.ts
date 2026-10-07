import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItemInput, CartState } from '../types/cart.types';
import { loadPersistedCart } from './cart.persistence';

export type {
  CartItemInput,
  CartProduct,
  CartState,
} from '../types/cart.types';

const initialState: CartState = loadPersistedCart();

const normalizeCart = (state: CartState) => {
  state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemInput>) => {
      const product = action.payload;
      const existing = state.items.find(item => item.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      normalizeCart(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const existing = state.items.find(item => item.id === id);

      if (!existing) {
        return;
      }

      existing.quantity = Math.max(0, quantity);

      if (existing.quantity === 0) {
        state.items = state.items.filter(item => item.id !== id);
      }

      normalizeCart(state);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      normalizeCart(state);
    },
    clearCart: () => initialState,
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
