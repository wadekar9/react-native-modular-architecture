import { configureStore, Reducer } from '@reduxjs/toolkit';
import reducer, { createRootReducer } from './redux.rootreducer';

const asyncReducers: Record<string, Reducer<any>> = {};

const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const injectReducer = (key: string, asyncReducer: Reducer<any>) => {
    if (!asyncReducers[key]) {
        asyncReducers[key] = asyncReducer;
        store.replaceReducer(createRootReducer(asyncReducers));
    }
};

export const removeReducer = (key: string) => {
    if (asyncReducers[key]) {
        delete asyncReducers[key];
        store.replaceReducer(createRootReducer(asyncReducers));
    }
};

export type ApplicationStateType = ReturnType<typeof store.getState> & {
    cart?: any;
    [key: string]: any;
};
export type ApplicationDispatch = typeof store.dispatch;
export default store;
