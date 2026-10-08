import { localDatabase } from '@core/database';
import type { FoodOrder } from '../types/order.types';

const FOOD_ORDERS_COLLECTION = 'food_orders';

export const getFoodOrdersCollection = () => {
  return localDatabase.collection<FoodOrder>(FOOD_ORDERS_COLLECTION);
};

export const loadPersistedFoodOrders = (): FoodOrder[] => {
  const collection = getFoodOrdersCollection();
  return collection.find(undefined, {
    sort: { field: 'createdAt', order: 'desc' },
  });
};

export const persistFoodOrder = (order: FoodOrder): FoodOrder => {
  const collection = getFoodOrdersCollection();
  return collection.upsert(order);
};

export const clearPersistedFoodOrders = (): void => {
  const collection = getFoodOrdersCollection();
  collection.clear();
};

