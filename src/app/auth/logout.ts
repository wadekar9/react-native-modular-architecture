import { clearSession, setSignedIn } from '@core/auth';
import store from '@core/store/redux.store';
import { setUser } from '@core/store/slices';
import { runLogoutHooks } from '@modules/registry';

export const logout = (): void => {
  clearSession();
  runLogoutHooks();
  store.dispatch(setUser(null));
  store.dispatch(setSignedIn(false));
};