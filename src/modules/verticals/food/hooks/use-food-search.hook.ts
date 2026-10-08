import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDebounce } from '@shared/hooks';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { addToCart } from '../store/cart.slice';
import { selectFoodCart } from '../store/food.selectors';
import { EFoodStackScreens } from '../constants/screens.constants';
import { toDemoCartItem, DEMO_RECIPE_PRICE_INR } from '../constants/recipe-pricing.constants';
import { useRecipeFeed, useRecipeMealTypes, useRecipeTags } from '../services/recipes.queries';
import type { Recipe, RecipeSortField, RecipeSortOrder } from '../types/recipe.types';
import type { FoodStackNavigationProps, FoodStackScreenProps } from '../types/navigation.types';

export const useFoodSearch = () => {

    const navigation = useNavigation<FoodStackNavigationProps>();
    const route = useRoute<FoodStackScreenProps<EFoodStackScreens.FOOD_SEARCH>['route']>();
    const initialParams = route.params ?? {};

    const dispatch = useAppDispatch();
    const cart = useAppSelector(selectFoodCart);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState(initialParams.tag ?? '');
    const [selectedMealType, setSelectedMealType] = useState(initialParams.mealType ?? '');
    const [sortBy, setSortBy] = useState<RecipeSortField>('rating');
    const [order, setOrder] = useState<RecipeSortOrder>('desc');
    const debouncedQuery = useDebounce(search.trim(), 350);
    const feedQuery = useRecipeFeed({ query: debouncedQuery, tag: selectedTag, mealType: selectedMealType, sortBy, order });
    const tagsQuery = useRecipeTags();
    const mealTypesQuery = useRecipeMealTypes();

    useEffect(() => {
        setSelectedTag(initialParams.tag ?? '');
        setSelectedMealType(initialParams.mealType ?? '');
    }, [initialParams.mealType, initialParams.tag]);

    const clearFilters = useCallback(() => {
        setSearch('');
        setSelectedTag('');
        setSelectedMealType('');
    }, []);

    const setSort = useCallback((field: RecipeSortField, nextOrder: RecipeSortOrder) => {
        setSortBy(field);
        setOrder(nextOrder);
    }, []);

    return {
        search,
        setSearch,
        selectedTag,
        selectedMealType,
        sortBy,
        order,
        recipes: feedQuery.data?.recipes ?? [],
        total: feedQuery.data?.total ?? 0,
        tags: tagsQuery.data ?? [],
        mealTypes: mealTypesQuery.data ?? [],
        cartCount: cart.count,
        demoPrice: DEMO_RECIPE_PRICE_INR,
        isLoading: feedQuery.isLoading,
        isError: feedQuery.isError,
        hasActiveFilters: Boolean(selectedTag || selectedMealType || search),
        setTag: setSelectedTag,
        setMealType: setSelectedMealType,
        setSort,
        addRecipe: (recipe: Recipe) => dispatch(addToCart(toDemoCartItem(recipe))),
        getQuantity: (recipeId: number) => cart.items.find(item => item.id === recipeId)?.quantity ?? 0,
        goBack: () => navigation.goBack(),
        openCart: () => navigation.navigate(EFoodStackScreens.FOOD_CART),
        openRecipe: (recipeId: number) => navigation.navigate(EFoodStackScreens.RECIPE_DETAILS, { recipeId }),
        clearFilters,
        retry: () => feedQuery.refetch(),
    };
};