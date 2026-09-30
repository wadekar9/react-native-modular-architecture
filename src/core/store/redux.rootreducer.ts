import { combineReducers } from '@reduxjs/toolkit';
import { authSessionReducer, authUserReducer } from '@core/auth';
import { cartReducer, flagsReducer } from './slices';

const reducer = combineReducers({
    session: authSessionReducer,
    user: authUserReducer,
    cart: cartReducer,
    flags: flagsReducer,
});

export default reducer;
