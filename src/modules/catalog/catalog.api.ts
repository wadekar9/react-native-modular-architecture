import { axiosInstance } from '@core/networking/axios-instance';

export type CatalogProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

type DummyJsonProductListResponse = {
  products: CatalogProduct[];
  total: number;
  skip: number;
  limit: number;
};

export const getCatalogProducts = async (category?: string): Promise<CatalogProduct[]> => {
  const path = category
    ? `/products/category/${encodeURIComponent(category)}`
    : '/products';
  const { data } = await axiosInstance.get<DummyJsonProductListResponse | CatalogProduct[]>(path, {
    params: { limit: 12 },
  });

  return Array.isArray(data) ? data : data.products;
};

export const getCatalogCategories = async (): Promise<string[]> => {
  const { data } = await axiosInstance.get<string[]>('/products/categories');
  return data;
};
