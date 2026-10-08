import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { useAppTranslation } from '@core/i18n';
import { EFoodStackScreens } from '../constants/screens.constants';
import { DEMO_RECIPE_PRICE_INR, getDemoDeliveryFee } from '../constants/recipe-pricing.constants';
import { clearCart } from '../store/cart.slice';
import { addFoodOrder } from '../store/orders.slice';
import { selectFoodCart } from '../store/food.selectors';
import type { FoodPaymentMethod } from '../types/order.types';
import type { FoodStackNavigationProps } from '../types/navigation.types';

export const useFoodPayment = () => {
  const navigation = useNavigation<FoodStackNavigationProps>();
  const { food_t } = useAppTranslation();

  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectFoodCart);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<FoodPaymentMethod>('UPI');
  const [error, setError] = useState('');
  const deliveryFee = getDemoDeliveryFee(cart.total);

  const fail = (message: string) => {
    setError(message);
    return false;
  };

  const placeOrder = () => {
    const cleanName = customerName.trim();
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanAddress = address.trim();
    if (!cart.items.length) return fail(food_t('VALIDATION_ADD_RECIPES'));
    if (cleanName.length < 2) return fail(food_t('VALIDATION_ENTER_NAME'));
    if (cleanPhone.length < 10) return fail(food_t('VALIDATION_ENTER_PHONE'));
    if (cleanAddress.length < 8) return fail(food_t('VALIDATION_ENTER_ADDRESS'));

    const orderId = `FOOD-${Date.now().toString(36).toUpperCase()}`;
    dispatch(addFoodOrder({
      id: orderId,
      createdAt: new Date().toISOString(),
      items: cart.items.map(item => ({ ...item })),
      subtotal: cart.total,
      deliveryFee,
      total: cart.total + deliveryFee,
      paymentMethod,
      status: 'Confirmed',
      customerName: cleanName,
      phone: cleanPhone,
      address: cleanAddress,
    }));
    dispatch(clearCart());
    navigation.navigate(EFoodStackScreens.ORDER_CONFIRMATION, { orderId });
    return true;
  };

  return {
    cart,
    customerName,
    phone,
    address,
    paymentMethod,
    error,
    total: cart.total + deliveryFee,
    deliveryFee,
    demoRecipePrice: DEMO_RECIPE_PRICE_INR,
    setCustomerName: (value: string) => { setCustomerName(value); setError(''); },
    setPhone: (value: string) => { setPhone(value); setError(''); },
    setAddress: (value: string) => { setAddress(value); setError(''); },
    setPaymentMethod,
    goBack: () => navigation.goBack(),
    placeOrder,
  };
};