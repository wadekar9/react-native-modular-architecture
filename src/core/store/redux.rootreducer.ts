import { combineReducers, Reducer } from '@reduxjs/toolkit';
import {
  authSessionReducer,
  authUserReducer,
  flagsReducer,
} from './slices';

export const staticReducers = {
  session: authSessionReducer,
  user: authUserReducer,
  flags: flagsReducer,
};

export const createRootReducer = (asyncReducers: Record<string, Reducer<any>> = {}) =>
  combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });

const reducer = createRootReducer();

export default reducer;
