import { clearSession, setSignedIn } from '@core/auth';
import store from '@core/store/redux.store';
import { setUser } from '@core/store/slices';

export const logout = (): void => {
  clearSession();
  store.dispatch(setSignedIn(false));
  store.dispatch(setUser(null));
};
