import { getJson, Storage } from '@core/storage';
import type { CartProduct, CartState } from '../types/cart.types';

const CART_STORAGE_KEY = '@food/cart.v2';

const isCartProduct = (value: unknown): value is CartProduct => {
  if (!value || typeof value !== 'object') return false;
  const product = value as Partial<CartProduct>;
  return Number.isInteger(product.id)
    && typeof product.title === 'string'
    && typeof product.price === 'number'
    && typeof product.image === 'string'
    && typeof product.category === 'string'
    && Number.isInteger(product.quantity)
    && Number(product.quantity) > 0;
};

const summarizeItems = (items: CartProduct[]): CartState => ({
  items,
  total: items.reduce((total, item) => total + item.price * item.quantity, 0),
  count: items.reduce((count, item) => count + item.quantity, 0),
});

export const loadPersistedCart = (): CartState => {
  const persisted = getJson<{ items?: unknown }>(CART_STORAGE_KEY);
  const items = Array.isArray(persisted?.items) ? persisted.items.filter(isCartProduct) : [];
  return summarizeItems(items);
};

export const persistCart = (cart: CartState): void => {
  Storage.set(CART_STORAGE_KEY, cart);
};

export const clearPersistedCart = (): void => {
  Storage.delete(CART_STORAGE_KEY);
};