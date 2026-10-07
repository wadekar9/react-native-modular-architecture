import type { CartItemInput } from '../store/cart.slice';

export const MENU_ITEMS: CartItemInput[] = [
  {
    id: 201,
    title: 'Miso-glazed salmon bowl',
    category: 'Balanced · Japanese',
    price: 420,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 202,
    title: 'Roasted tomato rigatoni',
    category: 'Vegetarian · Italian',
    price: 340,
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 203,
    title: 'Crispy chicken sandwich',
    category: 'Bestseller · Comfort',
    price: 290,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 204,
    title: 'Coconut curry prawns',
    category: 'Spicy · Coastal',
    price: 460,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 205,
    title: 'Wild mushroom bao',
    category: 'Plant-based · Asian',
    price: 260,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 206,
    title: 'Mango chia pudding',
    category: 'Gluten-free · Dessert',
    price: 180,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  },
];

export const MENU_CATEGORIES = [
  'All',
  ...new Set(MENU_ITEMS.map(item => item.category.split('·').pop()?.trim() ?? item.category)),
];