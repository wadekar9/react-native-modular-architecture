import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { resetSignInState } from '@core/store/slices';
import { signInThunk } from '../auth.thunks';
import { ILoginRequest } from '../types/auth.types';

export const useSignIn = () => {
  const dispatch = useAppDispatch();
  const { signInError: error, signInStatus: status } = useAppSelector(state => state.authRequest);

  const signIn = useCallback((credentialsOrUsername: ILoginRequest | string, password?: string) => {
    const payload = typeof credentialsOrUsername === 'string'
      ? { username: credentialsOrUsername, password: password || '' }
      : credentialsOrUsername;
    return dispatch(signInThunk(payload));
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(resetSignInState());
  }, [dispatch]);

  return {
    signIn,
    isLoading: status === 'pending',
    isSuccess: status === 'succeeded',
    error,
    resetError,
  };
};
