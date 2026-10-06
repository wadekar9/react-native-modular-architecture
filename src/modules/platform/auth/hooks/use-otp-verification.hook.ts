import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { resetOtpState } from '@core/store/slices';
import { forgotPasswordThunk, verifyOtpThunk } from '../auth.thunks';
import { IVerifyOtpRequest } from '../types/auth.types';

export const useOtpVerification = () => {
  const dispatch = useAppDispatch();
  const { otpError: error, otpStatus: status } = useAppSelector(state => state.authRequest);

  const verify = useCallback((payload: IVerifyOtpRequest) => {
    return dispatch(verifyOtpThunk(payload));
  }, [dispatch]);

  const resendOtp = useCallback((email: string) => {
    return dispatch(forgotPasswordThunk({ email }));
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(resetOtpState());
  }, [dispatch]);

  return {
    verifyOtp: verify,
    resendOtp,
    isLoading: status === 'pending',
    isSuccess: status === 'succeeded',
    error,
    resetError,
  };
};
