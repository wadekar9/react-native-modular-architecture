import { clearSession, setSignedIn, setUser } from '@core/auth';
import { clearCart } from '@core/store/slices/cart.slice';
import store from '@core/store/redux.store';
import { runLogoutHooks } from '@modules/registry';
import { queryClient } from '@app/providers/query.provider';

export const logout = (): void => {
  clearSession();
  store.dispatch(setSignedIn(false));
  store.dispatch(setUser(null));
  store.dispatch(clearCart());
  runLogoutHooks();
  queryClient.clear();
};
