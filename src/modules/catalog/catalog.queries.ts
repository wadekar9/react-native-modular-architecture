import { useQuery } from '@tanstack/react-query';
import { getCatalogCategories, getCatalogProducts } from './catalog.api';

export const catalogQueryKeys = {
  all: ['catalog'] as const,
  products: (category?: string) => ['catalog', 'products', category ?? 'all'] as const,
  categories: () => ['catalog', 'categories'] as const,
};

export const useCatalogProducts = (category?: string) =>
  useQuery({
    queryKey: catalogQueryKeys.products(category),
    queryFn: () => getCatalogProducts(category),
  });

export const useCatalogCategories = () =>
  useQuery({
    queryKey: catalogQueryKeys.categories(),
    queryFn: getCatalogCategories,
  });