import { cartReducer, addToCart, removeFromCart, clearCart } from '../src/modules/verticals/food/store/cart.slice';


describe('cart slice', () => {
  it('adds a product and increases quantity when the same product is added again', () => {
    let state = cartReducer(undefined, addToCart({
      id: 1,
      title: 'Burger',
      price: 25,
      image: 'https://example.com/burger.jpg',
      category: 'food',
    }));

    state = cartReducer(state, addToCart({
      id: 1,
      title: 'Burger',
      price: 25,
      image: 'https://example.com/burger.jpg',
      category: 'food',
    }));

    expect(state.items[0]).toMatchObject({ id: 1, quantity: 2, price: 25 });
    expect(state.total).toBe(50);
  });

  it('removes an item and clears the cart when requested', () => {
    const state = cartReducer(
      {
        items: [
          { id: 1, title: 'Burger', price: 25, image: 'https://example.com/burger.jpg', category: 'food', quantity: 2 },
        ],
        total: 50,
        count: 2,
      },
      removeFromCart(1),
    );

    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);

    const cleared = cartReducer(state, clearCart());
    expect(cleared.items).toEqual([]);
    expect(cleared.total).toBe(0);
  });
});
