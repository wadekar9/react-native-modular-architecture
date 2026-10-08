import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { addToCart } from '../store/cart.slice';
import { selectFoodCart } from '../store/food.selectors';
import { EFoodBottomScreens, EFoodStackScreens } from '../constants/screens.constants';
import { toDemoCartItem, DEMO_RECIPE_PRICE_INR } from '../constants/recipe-pricing.constants';
import { useRecipes, useRecipeTags } from '../services/recipes.queries';
import type { FoodStackNavigationProps } from '../types/navigation.types';
import type { Recipe, RecipeSortField, RecipeSortOrder } from '../types/recipe.types';

export const useFoodHome = () => {

  const navigation = useNavigation<FoodStackNavigationProps>();

  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectFoodCart);
  const [sortBy, setSortBy] = useState<RecipeSortField>('rating');
  const [order, setOrder] = useState<RecipeSortOrder>('desc');
  const recipesQuery = useRecipes(sortBy, order);
  const tagsQuery = useRecipeTags();
  const recipes = recipesQuery.data?.pages.reduce<Recipe[]>((all, page) => all.concat(page.recipes), []) ?? [];
  const featuredRecipe = recipes[0];

  return {
    cartCount: cart.count,
    demoPrice: DEMO_RECIPE_PRICE_INR,
    recipes,
    listRecipes: featuredRecipe ? recipes.filter(recipe => recipe.id !== featuredRecipe.id) : recipes,
    featuredRecipe,
    tags: tagsQuery.data?.slice(0, 12) ?? [],
    totalRecipes: recipesQuery.data?.pages[0]?.total ?? 0,
    sortBy,
    order,
    hasNextPage: recipesQuery.hasNextPage,
    isLoading: recipesQuery.isLoading,
    isError: recipesQuery.isError,
    isRefreshing: recipesQuery.isRefetching && !recipesQuery.isFetchingNextPage,
    isFetchingNextPage: recipesQuery.isFetchingNextPage,
    isTagsLoading: tagsQuery.isLoading,
    openRecipe: (recipeId: number) => navigation.navigate(EFoodStackScreens.RECIPE_DETAILS, { recipeId }),
    openTag: (tag: string) => navigation.navigate(EFoodStackScreens.FOOD_SEARCH, { tag }),
    openSearch: () => navigation.navigate(EFoodStackScreens.FOOD_SEARCH),
    openCart: () => navigation.navigate(EFoodStackScreens.FOOD_CART),
    openOrders: () => navigation.navigate(EFoodBottomScreens.MY_ORDERS as any),
    addRecipe: (recipe: Recipe) => dispatch(addToCart(toDemoCartItem(recipe))),
    getQuantity: (recipeId: number) => cart.items.find(item => item.id === recipeId)?.quantity ?? 0,
    selectSort: (nextSortBy: RecipeSortField, nextOrder: RecipeSortOrder) => {
      setSortBy(nextSortBy);
      setOrder(nextOrder);
    },
    loadMore: () => {
      if (recipesQuery.hasNextPage && !recipesQuery.isFetchingNextPage) {
        return recipesQuery.fetchNextPage();
      }
      return Promise.resolve();
    },
    refresh: () => Promise.all([recipesQuery.refetch(), tagsQuery.refetch()]),
    retry: () => recipesQuery.refetch(),
  };
};