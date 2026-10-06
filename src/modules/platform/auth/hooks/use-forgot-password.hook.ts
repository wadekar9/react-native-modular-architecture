import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { resetForgotPasswordState } from '@core/store/slices';
import { forgotPasswordThunk } from '../auth.thunks';
import { IForgotPasswordRequest } from '../types/auth.types';

export const useForgotPassword = () => {
  const dispatch = useAppDispatch();
  const { forgotPasswordError: error, forgotPasswordStatus: status } = useAppSelector(state => state.authRequest);

  const requestForgotPassword = useCallback((payload: IForgotPasswordRequest | string) => {
    const data = typeof payload === 'string' ? { email: payload } : payload;
    return dispatch(forgotPasswordThunk(data));
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(resetForgotPasswordState());
  }, [dispatch]);

  return {
    forgotPassword: requestForgotPassword,
    isLoading: status === 'pending',
    isSuccess: status === 'succeeded',
    error,
    resetError,
  };
};
