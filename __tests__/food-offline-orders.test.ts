import {
  clearPersistedFoodOrders,
  loadPersistedFoodOrders,
  persistFoodOrder,
} from '../src/modules/verticals/food/store/orders.persistence';
import {
  foodOrdersReducer,
  addFoodOrder,
  setFoodOrders,
  clearFoodOrders,
} from '../src/modules/verticals/food/store/orders.slice';
import { offlineSync } from '../src/core/database/offline-sync.service';
import type { FoodOrder } from '../src/modules/verticals/food/types/order.types';

describe('Food Orders Offline Local Database & Sync', () => {
  beforeEach(() => {
    clearPersistedFoodOrders();
    offlineSync.clearAll();
  });

  const mockOrder = (id: string, createdAt: string, total: number): FoodOrder => ({
    id,
    createdAt,
    items: [
      {
        id: 1,
        title: 'Spaghetti Bolognese',
        price: 15,
        image: 'https://example.com/pasta.jpg',
        category: 'Italian',
        quantity: 2,
      },
    ],
    subtotal: total - 3,
    deliveryFee: 3,
    total,
    paymentMethod: 'UPI',
    status: 'Confirmed',
    customerName: 'John Doe',
    phone: '9876543210',
    address: '123 Baker Street',
  });

  it('persists food orders into the local database and loads them in chronological order', () => {
    const order1 = mockOrder('FOOD-01', '2026-10-01T10:00:00.000Z', 33);
    const order2 = mockOrder('FOOD-02', '2026-10-02T12:00:00.000Z', 45);

    persistFoodOrder(order1);
    persistFoodOrder(order2);

    const orders = loadPersistedFoodOrders();
    expect(orders).toHaveLength(2);
    // Newest first
    expect(orders[0].id).toBe('FOOD-02');
    expect(orders[1].id).toBe('FOOD-01');
  });

  it('clears persisted food orders on logout or reset', () => {
    persistFoodOrder(mockOrder('FOOD-01', '2026-10-01T10:00:00.000Z', 33));
    expect(loadPersistedFoodOrders()).toHaveLength(1);

    clearPersistedFoodOrders();
    expect(loadPersistedFoodOrders()).toHaveLength(0);
  });

  it('enqueues food order creation to offline outbox', () => {
    const order = mockOrder('FOOD-99', new Date().toISOString(), 50);

    // Save to local DB + enqueue to outbox
    persistFoodOrder(order);
    offlineSync.enqueue('food_order', 'create', order);

    const pending = offlineSync.getPendingMutations();
    expect(pending).toHaveLength(1);
    expect(pending[0].entityType).toBe('food_order');
    expect(pending[0].payload.id).toBe('FOOD-99');
  });

  it('updates Redux slice with setFoodOrders and addFoodOrder', () => {
    const order1 = mockOrder('FOOD-A', '2026-10-01T10:00:00.000Z', 20);
    const order2 = mockOrder('FOOD-B', '2026-10-02T10:00:00.000Z', 30);

    // Hydration
    let state = foodOrdersReducer(undefined, setFoodOrders([order1]));
    expect(state.orders).toHaveLength(1);

    // Add new order
    state = foodOrdersReducer(state, addFoodOrder(order2));
    expect(state.orders).toHaveLength(2);
    expect(state.orders[0].id).toBe('FOOD-B');

    // Clear
    state = foodOrdersReducer(state, clearFoodOrders());
    expect(state.orders).toHaveLength(0);
  });
});

