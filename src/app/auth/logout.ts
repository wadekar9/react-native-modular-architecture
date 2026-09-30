import { clearSession, setSignedIn, setUser } from '@core/auth';
import store from '@core/store/redux.store';

export const logout = (): void => {
  clearSession();
  store.dispatch(setSignedIn(false));
  store.dispatch(setUser(null));
};
