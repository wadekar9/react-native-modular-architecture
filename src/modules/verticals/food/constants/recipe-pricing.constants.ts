import type { Recipe } from '../types/recipe.types';
import type { CartItemInput } from '../types/cart.types';

export const DEMO_RECIPE_PRICE_INR = 249;
export const DEMO_DELIVERY_FEE_INR = 40;
export const DEMO_FREE_DELIVERY_THRESHOLD_INR = 500;

export const getDemoDeliveryFee = (subtotal: number): number =>
  subtotal === 0 || subtotal >= DEMO_FREE_DELIVERY_THRESHOLD_INR ? 0 : DEMO_DELIVERY_FEE_INR;

export const toDemoCartItem = (recipe: Recipe): CartItemInput => ({
  id: recipe.id,
  title: recipe.name,
  price: DEMO_RECIPE_PRICE_INR,
  image: recipe.image,
  category: [recipe.cuisine, ...recipe.tags.slice(0, 2)].filter(Boolean).join(' · '),
});