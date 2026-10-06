import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@core/store/hooks';
import { setSignedIn, setUser } from '@core/store/slices';
import { saveAccessToken } from '@core/storage/session.storage';
import { showFlashMessage, showErrorFlashMessage } from '@shared/utils';
import { login } from '../services/auth.api';
import type { ILoginRequest } from '../types/auth.types';

export const useSignIn = () => {
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: async (credentials: ILoginRequest) => {
      return login({ ...credentials, expiresInMins: 60 });
    },
    onSuccess: (result) => {
      const token = result.token || result.accessToken;
      if (token) {
        saveAccessToken(token);
      }
      dispatch(
        setUser({
          id: String(result.id),
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          avatar: result.image,
        })
      );
      dispatch(setSignedIn(true));
      showFlashMessage({
        type: 'success',
        message: 'Signed In',
        description: `Welcome back, ${result.firstName || result.username}!`,
      });
    },
    onError: (err: Error) => {
      showErrorFlashMessage(err.message || 'Unable to sign in. Please try again.');
    },
  });

  const signIn = useCallback(
    (credentialsOrUsername: ILoginRequest | string, password?: string) => {
      const payload: ILoginRequest =
        typeof credentialsOrUsername === 'string'
          ? { username: credentialsOrUsername, password: password || '' }
          : credentialsOrUsername;
      return mutation.mutateAsync(payload);
    },
    [mutation]
  );

  return {
    signIn,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message ?? null,
    resetError: mutation.reset,
  };
};
