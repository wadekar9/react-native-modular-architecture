import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { useRecipe } from '../services/recipes.queries';
import { DEMO_RECIPE_PRICE_INR, toDemoCartItem } from '../constants/recipe-pricing.constants';
import { addToCart } from '../store/cart.slice';
import { selectFoodCart } from '../store/food.selectors';
import type { FoodStackNavigationProps } from '../types/navigation.types';

export const useRecipeDetails = (recipeID : number) => {

  const navigation = useNavigation<FoodStackNavigationProps>();

  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectFoodCart);
  const recipeQuery = useRecipe(recipeID);
  const recipe = recipeQuery.data;

  return {
    recipe,
    isLoading: recipeQuery.isLoading,
    isError: recipeQuery.isError || !recipe,
    demoPrice: DEMO_RECIPE_PRICE_INR,
    cartQuantity: cart.items.find(item => item.id === recipeID)?.quantity ?? 0,
    addToBasket: () => { if (recipe) dispatch(addToCart(toDemoCartItem(recipe))); },
    retry: () => recipeQuery.refetch(),
    goBack: () => navigation.goBack(),
  };
};