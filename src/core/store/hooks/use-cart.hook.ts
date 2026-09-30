import { useAppDispatch, useAppSelector } from './store-dispatch-selector.hook';
import { addToCart, type CartItemInput } from '../slices/cart.slice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector(state => state.cart.count);
  const total = useAppSelector(state => state.cart.total);

  const addProduct = (product: CartItemInput): void => {
    dispatch(addToCart(product));
  };

  return { itemCount, total, addProduct };
};