import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@core/store/hooks';
import { EFoodBottomScreens, EFoodStackScreens } from '../constants/screens.constants';
import { selectFoodOrders } from '../store/food.selectors';
import type { FoodStackNavigationProps } from '../types/navigation.types';

export const useFoodOrders = () => {

  const navigation = useNavigation<FoodStackNavigationProps>();

  const orders = useAppSelector(selectFoodOrders).orders;
  return {
    orders,
    openOrder: (orderId: string) => navigation.navigate(EFoodStackScreens.ORDER_DETAILS, { orderId }),
    browseRecipes: () => navigation.navigate(EFoodBottomScreens.FOOD_HOME as any),
  };
};