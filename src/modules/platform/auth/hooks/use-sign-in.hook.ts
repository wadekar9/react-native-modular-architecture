import { useAppDispatch } from '@core/store/hooks/store-dispatch-selector.hook';
import { saveAccessToken, setSignedIn, setUser } from '@core/auth';
import { login } from '../services/auth.api';

export const useSignIn = () => {
  const dispatch = useAppDispatch();

  return async (username: string, password: string): Promise<void> => {
    const result = await login({ username, password, expiresInMins: 60 });

    saveAccessToken(result.token);
    dispatch(setUser({
      id: String(result.id),
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      avatar: result.image,
    }));
    dispatch(setSignedIn(true));
  };
};