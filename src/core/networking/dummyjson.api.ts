import { axiosInstance } from './axios-instance';

export type DummyJsonLoginRequest = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export type DummyJsonLoginResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
};

export type DummyJsonProduct = {
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

export type DummyJsonProductListResponse = {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
};

export const loginToDummyJson = async (
  payload: DummyJsonLoginRequest,
): Promise<DummyJsonLoginResponse> => {
  const { data } = await axiosInstance.post<DummyJsonLoginResponse>(
    '/auth/login',
    payload,
  );
  return data;
};

export const fetchDummyJsonProducts = async (
  category?: string,
): Promise<DummyJsonProduct[]> => {
  const path = category
    ? `/products/category/${encodeURIComponent(category)}`
    : '/products';

  const { data } = await axiosInstance.get<DummyJsonProductListResponse | DummyJsonProduct[]>(path, {
    params: { limit: 12 },
  });

  return Array.isArray(data) ? data : data.products;
};

export const fetchDummyJsonCategories = async (): Promise<string[]> => {
  const { data } = await axiosInstance.get<string[]>('/products/categories');
  return data;
};
