import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { resetRegisterState } from '@core/store/slices';
import { registerThunk } from '../auth.thunks';
import { IRegisterRequest } from '../types/auth.types';

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const { registerError: error, registerStatus: status } = useAppSelector(state => state.authRequest);

  const registerUser = useCallback((payload: IRegisterRequest) => {
    return dispatch(registerThunk(payload));
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(resetRegisterState());
  }, [dispatch]);

  return {
    register: registerUser,
    isLoading: status === 'pending',
    isSuccess: status === 'succeeded',
    error,
    resetError,
  };
};
