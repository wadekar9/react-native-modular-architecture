export type CartProduct = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
};

export type CartItemInput = Omit<CartProduct, 'quantity'>;

export type CartState = {
  items: CartProduct[];
  total: number;
  count: number;
};