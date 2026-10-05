import { useAppDispatch, useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';
import { signInThunk } from '../auth.thunks';

export const useSignIn = () => {
  const dispatch = useAppDispatch();
  const {signInError: error, signInStatus: status} = useAppSelector(state => state.authRequest);

  const signIn = (username: string, password: string) =>
    dispatch(signInThunk({ username, password }));

  return {
    signIn,
    isLoading: status === 'pending',
    error,
  };
};