import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { showFlashMessage, showErrorFlashMessage } from '@shared/utils';
import { verifyOtp, forgotPassword } from '../services/auth.api';
import type { IVerifyOtpRequest } from '../types/auth.types';

export const useOtpVerification = () => {
  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (result) => {
      showFlashMessage({
        type: 'success',
        message: 'OTP Verified',
        description: result.message || 'OTP verified successfully.',
      });
    },
    onError: (err: Error) => {
      showErrorFlashMessage(err.message || 'Invalid OTP. Please try again.');
    },
  });

  const resendMutation = useMutation({
    mutationFn: (email: string) => forgotPassword({ email }),
    onSuccess: () => {
      showFlashMessage({
        type: 'info',
        message: 'Code Resent',
        description: 'A new verification code was sent to your email.',
      });
    },
    onError: (err: Error) => {
      showErrorFlashMessage(err.message || 'Failed to resend code.');
    },
  });

  const verify = useCallback(
    (payload: IVerifyOtpRequest) => {
      return verifyMutation.mutateAsync(payload);
    },
    [verifyMutation]
  );

  const resend = useCallback(
    (email: string) => {
      return resendMutation.mutateAsync(email);
    },
    [resendMutation]
  );

  return {
    verifyOtp: verify,
    resendOtp: resend,
    isLoading: verifyMutation.isPending || resendMutation.isPending,
    isSuccess: verifyMutation.isSuccess,
    error: verifyMutation.error?.message ?? resendMutation.error?.message ?? null,
    resetError: () => {
      verifyMutation.reset();
      resendMutation.reset();
    },
  };
};
