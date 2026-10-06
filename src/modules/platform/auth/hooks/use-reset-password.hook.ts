import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { showFlashMessage, showErrorFlashMessage } from '@shared/utils';
import { resetPassword } from '../services/auth.api';
import type { IResetPasswordRequest } from '../types/auth.types';

export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (result) => {
      showFlashMessage({
        type: 'success',
        message: 'Password Reset',
        description: result.message || 'Your password was successfully reset. Please sign in.',
      });
    },
    onError: (err: Error) => {
      showErrorFlashMessage(err.message || 'Unable to reset password. Please try again.');
    },
  });

  const resetPasswordAction = useCallback(
    (payload: IResetPasswordRequest) => {
      return mutation.mutateAsync(payload);
    },
    [mutation]
  );

  return {
    resetPassword: resetPasswordAction,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message ?? null,
    resetError: mutation.reset,
  };
};
