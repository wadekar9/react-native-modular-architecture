import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { showFlashMessage, showErrorFlashMessage } from '@shared/utils';
import { forgotPassword } from '../services/auth.api';
import type { IForgotPasswordRequest } from '../types/auth.types';

export const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: (payload: IForgotPasswordRequest | string) => {
      const data: IForgotPasswordRequest =
        typeof payload === 'string' ? { email: payload } : payload;
      return forgotPassword(data);
    },
    onSuccess: (result) => {
      showFlashMessage({
        type: 'success',
        message: 'Code Sent',
        description: result.message || 'Verification code sent to your email.',
      });
    },
    onError: (err: Error) => {
      showErrorFlashMessage(err.message || 'Unable to send OTP. Please try again.');
    },
  });

  const requestForgotPassword = useCallback(
    (payload: IForgotPasswordRequest | string) => {
      return mutation.mutateAsync(payload);
    },
    [mutation]
  );

  return {
    forgotPassword: requestForgotPassword,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message ?? null,
    resetError: mutation.reset,
  };
};
