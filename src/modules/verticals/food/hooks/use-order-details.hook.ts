import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@core/store/hooks';
import { selectFoodOrders } from '../store/food.selectors';
import type { FoodStackNavigationProps } from '../types/navigation.types';

export const useOrderDetails = (orderID: string) => {

  const navigation = useNavigation<FoodStackNavigationProps>();
  const order = useAppSelector(selectFoodOrders).orders.find(item => item.id === orderID);

  return {
    order,
    itemCount: order?.items.reduce((count, item) => count + item.quantity, 0) ?? 0,
    statusSteps: ['Confirmed', 'Preparing', 'On the way', 'Delivered'] as const,
    goBack: () => navigation.goBack(),
  };

};