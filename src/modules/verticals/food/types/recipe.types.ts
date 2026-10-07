export type Recipe = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
};

export type RecipeListResponse = {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
};

export type RecipeSortField = 'name' | 'rating' | 'prepTimeMinutes';
export type RecipeSortOrder = 'asc' | 'desc';

export type RecipeFilters = {
  query?: string;
  tag?: string;
  mealType?: string;
  sortBy?: RecipeSortField;
  order?: RecipeSortOrder;
};

export type RecipePagination = {
  limit?: number;
  skip?: number;
};