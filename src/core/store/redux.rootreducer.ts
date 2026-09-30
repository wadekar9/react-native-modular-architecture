import { combineReducers } from '@reduxjs/toolkit';
import { authSessionReducer } from '@core/auth';
import { authUserReducer, cartReducer, flagsReducer } from './slices';

const reducer = combineReducers({
    session: authSessionReducer,
    user: authUserReducer,
    cart: cartReducer,
    flags: flagsReducer,
});

export default reducer;
