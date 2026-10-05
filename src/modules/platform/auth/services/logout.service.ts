import { clearSession } from '@core/storage/session.storage';
import { clearCart, setSignedIn, setUser } from '@core/store/slices';
import store from '@core/store/redux.store';

export const logout = (): void => {
  clearSession();
  store.dispatch(setSignedIn(false));
  store.dispatch(setUser(null));
  store.dispatch(clearCart());
};
