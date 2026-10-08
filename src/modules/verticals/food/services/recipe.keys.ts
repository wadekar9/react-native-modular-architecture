import type { RecipeFilters, RecipeSortField, RecipeSortOrder } from '../types/recipe.types';

export const recipeKeys = {
  all: ['food', 'recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (sortBy?: RecipeSortField, order?: RecipeSortOrder) => [...recipeKeys.lists(), { sortBy, order }] as const,
  feed: (filters: RecipeFilters) => [...recipeKeys.all, 'feed', filters] as const,
  detail: (recipeId: number) => [...recipeKeys.all, 'detail', recipeId] as const,
  tags: () => [...recipeKeys.all, 'tags'] as const,
  mealTypes: () => [...recipeKeys.all, 'mealTypes'] as const,
};