import type { CartProduct } from '../store/cart.slice';

export type FoodPaymentMethod = 'UPI' | 'Card' | 'Cash on delivery';
export type FoodOrderStatus = 'Confirmed' | 'Preparing' | 'On the way' | 'Delivered';

export type FoodOrder = {
  id: string;
  createdAt: string;
  items: CartProduct[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: FoodPaymentMethod;
  status: FoodOrderStatus;
  customerName: string;
  phone: string;
  address: string;
};