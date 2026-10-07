import { configureStore, Reducer } from '@reduxjs/toolkit';
import reducer, { createRootReducer } from './redux.rootreducer';

/**
 * ============================================================================
 * REDUX STORE & DYNAMIC REDUCER INJECTION
 * ============================================================================
 *
 * This file configures the centralized Redux store and provides runtime
 * APIs (`injectReducer` & `removeReducer`) to dynamically attach and detach
 * vertical domain state slices.
 *
 * WHY DYNAMIC INJECTION IS ESSENTIAL FOR MODULAR ARCHITECTURE:
 *
 * 1. ZERO STATIC COUPLING:
 *    The core store only knows about baseline app slices (`session`, `user`, `flags`).
 *    It has ZERO static imports for vertical slices (e.g. no `import { cartReducer } from '@modules/verticals/food'`).
 *    This ensures that vertical packages can be added or deleted without editing this file.
 *
 * 2. CODE SPLITTING & ON-DEMAND LOADING:
 *    When a vertical is activated via `getActiveVerticals()`, its `onRegister` lifecycle
 *    hook calls `injectReducer('cart', cartReducer)`.
 *    `store.replaceReducer()` swaps the root reducer with a newly combined reducer
 *    including the vertical slice, preserving existing state while mounting the new slice.
 *
 * 3. RUNTIME CLEANUP:
 *    If a vertical is disabled via a feature flag, `removeReducer` can detach it.
 */

// Internal dictionary tracking all dynamically registered vertical reducers
const asyncReducers: Record<string, Reducer<any>> = {};

const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

/**
 * Dynamically registers an async vertical reducer slice into the running Redux store.
 *
 * @param key Slice key name in the global Redux state tree (e.g., 'cart')
 * @param asyncReducer The Redux reducer function from the vertical
 */
export const injectReducer = (key: string, asyncReducer: Reducer<any>) => {
    if (!asyncReducers[key]) {
        asyncReducers[key] = asyncReducer;
        store.replaceReducer(createRootReducer(asyncReducers));
    }
};

/**
 * Dynamically detaches an async reducer slice from the Redux store.
 *
 * @param key Slice key to remove
 */
export const removeReducer = (key: string) => {
    if (asyncReducers[key]) {
        delete asyncReducers[key];
        store.replaceReducer(createRootReducer(asyncReducers));
    }
};

export type ApplicationStateType = ReturnType<typeof store.getState>;
export type ApplicationDispatch = typeof store.dispatch;
export default store;
