import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { resetResetPasswordState } from '@core/store/slices';
import { resetPasswordThunk } from '../auth.thunks';
import { IResetPasswordRequest } from '../types/auth.types';

export const useResetPassword = () => {
  const dispatch = useAppDispatch();
  const { resetPasswordError: error, resetPasswordStatus: status } = useAppSelector(state => state.authRequest);

  const resetPasswordAction = useCallback((payload: IResetPasswordRequest) => {
    return dispatch(resetPasswordThunk(payload));
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(resetResetPasswordState());
  }, [dispatch]);

  return {
    resetPassword: resetPasswordAction,
    isLoading: status === 'pending',
    isSuccess: status === 'succeeded',
    error,
    resetError,
  };
};
