import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchRecipeById, fetchRecipeFeed, fetchRecipeMealTypes, fetchRecipeTags, fetchRecipes } from './recipes.api';
import { recipeKeys } from './recipe.keys';
import type { RecipeFilters, RecipeListResponse, RecipeSortField, RecipeSortOrder } from '../types/recipe.types';

const RECIPE_PAGE_SIZE = 20;

export const useRecipes = (sortBy: RecipeSortField = 'name', order: RecipeSortOrder = 'asc') =>
  useInfiniteQuery({
    queryKey: recipeKeys.list(sortBy, order),
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }): Promise<RecipeListResponse> =>
      fetchRecipes({ limit: RECIPE_PAGE_SIZE, skip: pageParam, sortBy, order }, signal),
    getNextPageParam: lastPage => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });

export const useRecipeFeed = (filters: RecipeFilters) =>
  useQuery({
    queryKey: recipeKeys.feed(filters),
    queryFn: ({ signal }) => fetchRecipeFeed(filters, signal),
  });

export const useRecipe = (recipeId: number) =>
  useQuery({
    queryKey: recipeKeys.detail(recipeId),
    queryFn: ({ signal }) => fetchRecipeById(recipeId, signal),
    enabled: Number.isInteger(recipeId) && recipeId > 0,
  });

export const useRecipeTags = () =>
  useQuery({
    queryKey: recipeKeys.tags(),
    queryFn: ({ signal }) => fetchRecipeTags(signal),
  });

export const useRecipeMealTypes = () =>
  useQuery({
    queryKey: recipeKeys.mealTypes(),
    queryFn: ({ signal }) => fetchRecipeMealTypes(signal),
    staleTime: 1000 * 60 * 60,
  });