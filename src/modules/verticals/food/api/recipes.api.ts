import { axiosInstance } from '@core/networking/axios-instance';
import type {
  Recipe,
  RecipeFilters,
  RecipeListResponse,
  RecipePagination,
  RecipeSortField,
  RecipeSortOrder,
} from '../types/recipe.types';

type RecipeRequestOptions = RecipePagination & {
  sortBy?: RecipeSortField;
  order?: RecipeSortOrder;
  select?: string;
};

const DEFAULT_LIMIT = 20;

export const fetchRecipes = async (
  options: RecipeRequestOptions = {},
  signal?: AbortSignal,
): Promise<RecipeListResponse> => {
  const { data } = await axiosInstance.get<RecipeListResponse>('/recipes', {
    params: { limit: DEFAULT_LIMIT, ...options },
    signal,
  });
  return data;
};

export const fetchRecipeById = async (recipeId: number, signal?: AbortSignal): Promise<Recipe> => {
  const { data } = await axiosInstance.get<Recipe>(`/recipes/${recipeId}`, { signal });
  return data;
};

export const searchRecipes = async (
  query: string,
  pagination: RecipePagination = { limit: 100, skip: 0 },
  signal?: AbortSignal,
): Promise<RecipeListResponse> => {
  const { data } = await axiosInstance.get<RecipeListResponse>('/recipes/search', {
    params: { q: query, ...pagination },
    signal,
  });
  return data;
};

export const fetchRecipeTags = async (signal?: AbortSignal): Promise<string[]> => {
  const { data } = await axiosInstance.get<string[]>('/recipes/tags', { signal });
  return data;
};

export const fetchRecipesByTag = async (
  tag: string,
  pagination: RecipePagination = { limit: 100, skip: 0 },
  signal?: AbortSignal,
): Promise<RecipeListResponse> => {
  const { data } = await axiosInstance.get<RecipeListResponse>(`/recipes/tag/${encodeURIComponent(tag)}`, {
    params: pagination,
    signal,
  });
  return data;
};

export const fetchRecipesByMealType = async (
  mealType: string,
  pagination: RecipePagination = { limit: 100, skip: 0 },
  signal?: AbortSignal,
): Promise<RecipeListResponse> => {
  const { data } = await axiosInstance.get<RecipeListResponse>(`/recipes/meal-type/${encodeURIComponent(mealType)}`, {
    params: pagination,
    signal,
  });
  return data;
};

const sortRecipes = (recipes: Recipe[], sortBy?: RecipeSortField, order: RecipeSortOrder = 'asc') => {
  if (!sortBy) return recipes;
  const direction = order === 'asc' ? 1 : -1;
  return [...recipes].sort((left, right) => {
    const leftValue = left[sortBy];
    const rightValue = right[sortBy];
    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
      return leftValue.localeCompare(rightValue) * direction;
    }
    return (Number(leftValue) - Number(rightValue)) * direction;
  });
};

export const fetchRecipeFeed = async (
  filters: RecipeFilters,
  signal?: AbortSignal,
): Promise<RecipeListResponse> => {
  const pagination = { limit: 100, skip: 0 };
  let response: RecipeListResponse;

  if (filters.query?.trim()) {
    response = await searchRecipes(filters.query.trim(), pagination, signal);
  } else if (filters.tag) {
    response = await fetchRecipesByTag(filters.tag, pagination, signal);
  } else if (filters.mealType) {
    response = await fetchRecipesByMealType(filters.mealType, pagination, signal);
  } else {
    response = await fetchRecipes({ ...pagination, sortBy: filters.sortBy, order: filters.order }, signal);
  }

  const normalizedQuery = filters.query?.trim().toLowerCase();
  const filteredRecipes = response.recipes.filter(recipe => {
    const matchesQuery = !normalizedQuery || [
      recipe.name,
      recipe.cuisine,
      ...recipe.ingredients,
      ...recipe.tags,
    ].some(value => value.toLowerCase().includes(normalizedQuery));
    const matchesTag = !filters.tag || recipe.tags.some(tag => tag.toLowerCase() === filters.tag?.toLowerCase());
    const matchesMealType = !filters.mealType || recipe.mealType.some(meal => meal.toLowerCase() === filters.mealType?.toLowerCase());
    return matchesQuery && matchesTag && matchesMealType;
  });

  return {
    ...response,
    recipes: sortRecipes(filteredRecipes, filters.sortBy, filters.order),
    total: filteredRecipes.length,
    skip: 0,
    limit: filteredRecipes.length,
  };
};

export const fetchRecipeMealTypes = async (signal?: AbortSignal): Promise<string[]> => {
  const recipes = await fetchRecipes({ limit: 0, select: 'mealType' }, signal);
  const mealTypes = recipes.recipes.reduce<string[]>((types, recipe) => types.concat(recipe.mealType), []);
  return [...new Set(mealTypes)].sort((left, right) => left.localeCompare(right));
};