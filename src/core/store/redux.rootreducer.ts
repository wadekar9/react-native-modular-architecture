import { combineReducers, Reducer } from '@reduxjs/toolkit';
import {
  authSessionReducer,
  authUserReducer,
  flagsReducer,
} from './slices';

/**
 * ============================================================================
 * ROOT REDUCER FACTORY (STATIC + ASYNC REDUCERS)
 * ============================================================================
 *
 * This file separates static core reducers from asynchronously injected
 * vertical reducers.
 *
 * ARCHITECTURAL SEPARATION:
 * 1. `staticReducers`:
 *    Base application state required for the app to function regardless of which
 *    verticals are active (e.g. user session, user profile, and feature flags).
 *    Notice that NO vertical slices (like cart, menu, reservations) are listed here!
 *
 * 2. `createRootReducer(asyncReducers)`:
 *    A factory function that combines static baseline reducers with any
 *    dynamically registered vertical reducers provided by `injectReducer()`.
 *    This allows the Redux state tree to grow or shrink dynamically as verticals
 *    are enabled or disabled.
 */

export const staticReducers = {
  session: authSessionReducer,
  user: authUserReducer,
  flags: flagsReducer,
};

/**
 * Creates the combined root reducer by merging static core reducers with
 * dynamically injected vertical async reducers.
 *
 * @param asyncReducers Dictionary of dynamically injected vertical slices
 */
export const createRootReducer = (asyncReducers: Record<string, Reducer<any>> = {}) =>
  combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });

const reducer = createRootReducer();

export default reducer;
