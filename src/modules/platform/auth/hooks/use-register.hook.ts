import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { showFlashMessage, showErrorFlashMessage } from '@shared/utils';
import { register } from '../services/auth.api';
import type { IRegisterRequest } from '../types/auth.types';

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (result) => {
      showFlashMessage({
        type: 'success',
        message: 'Account Created',
        description: result.message || 'Your account was created successfully. Please sign in.',
      });
    },
    onError: (err: Error) => {
      showErrorFlashMessage(err.message || 'Unable to register. Please try again.');
    },
  });

  const registerUser = useCallback(
    (payload: IRegisterRequest) => {
      return mutation.mutateAsync(payload);
    },
    [mutation]
  );

  return {
    register: registerUser,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message ?? null,
    resetError: mutation.reset,
  };
};
