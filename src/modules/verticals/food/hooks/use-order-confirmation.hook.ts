import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@core/store/hooks';
import { EFoodBottomScreens, EFoodStackScreens } from '../constants/screens.constants';
import { selectFoodOrders } from '../store/food.selectors';
import type { FoodStackNavigationProps } from '../types/navigation.types';

export const useOrderConfirmation = (orderID: string) => {

  const navigation = useNavigation<FoodStackNavigationProps>();

  const order = useAppSelector(selectFoodOrders).orders.find(item => item.id === orderID);

  return {
    order,
    backToFood: () => navigation.navigate(EFoodStackScreens.FOOD_BOTTOM_TAB),
    openOrderDetails: () => { if (order) navigation.navigate(EFoodStackScreens.ORDER_DETAILS, { orderId: order.id }); },
    openOrders: () => navigation.navigate(EFoodStackScreens.FOOD_BOTTOM_TAB, { screen: EFoodBottomScreens.MY_ORDERS }),
  };

};