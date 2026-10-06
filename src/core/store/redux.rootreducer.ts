import { combineReducers, Reducer } from '@reduxjs/toolkit';
import {
  authRequestReducer,
  authSessionReducer,
  authUserReducer,
  flagsReducer,
} from './slices';

export const staticReducers = {
  session: authSessionReducer,
  user: authUserReducer,
  authRequest: authRequestReducer,
  flags: flagsReducer,
};

export const createRootReducer = (asyncReducers: Record<string, Reducer<any>> = {}) =>
  combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });

const reducer = createRootReducer();

export default reducer;
