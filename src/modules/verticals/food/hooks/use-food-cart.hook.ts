import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { EFoodStackScreens } from '../constants/screens.constants';
import { getDemoDeliveryFee } from '../constants/recipe-pricing.constants';
import { clearCart, removeFromCart, updateQuantity } from '../store/cart.slice';
import { selectFoodCart } from '../store/food.selectors';
import type { FoodStackNavigationProps } from '../types/navigation.types';

export const useFoodCart = () => {

  const navigation = useNavigation<FoodStackNavigationProps>();

  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectFoodCart);
  const deliveryFee = getDemoDeliveryFee(cart.total);

  return {
    cart,
    deliveryFee,
    total: cart.total + deliveryFee,
    goBack: () => navigation.goBack(),
    browseRecipes: () => navigation.navigate(EFoodStackScreens.FOOD_BOTTOM_TAB),
    checkout: () => navigation.navigate(EFoodStackScreens.FOOD_PAYMENT),
    removeItem: (id: number) => dispatch(removeFromCart(id)),
    updateItemQuantity: (id: number, quantity: number) => dispatch(updateQuantity({ id, quantity })),
    clear: () => dispatch(clearCart()),
  };
};