export const RECIPE_API_ROUTES = {
    RECIPES: '/recipes',
    RECIPE_BY_ID: (recipeId: number) => `/recipes/${recipeId}`,
    SEARCH: '/recipes/search',
    RECIPE_TAGS: '/recipes/tags',
    RECIPES_BY_TAG: (tag: string) => `/recipes/tag/${encodeURIComponent(tag)}`,
    RECIPES_BY_MEAL_TYPE: (mealType: string) => `/recipes/meal-type/${encodeURIComponent(mealType)}`,
} as const;