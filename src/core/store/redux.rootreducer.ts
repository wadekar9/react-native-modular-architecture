import { combineReducers } from '@reduxjs/toolkit';
import { authRequestReducer, authSessionReducer, authUserReducer } from '@core/auth';
import { cartReducer, flagsReducer } from './slices';

const reducer = combineReducers({
    session: authSessionReducer,
    user: authUserReducer,
    authRequest: authRequestReducer,
    cart: cartReducer,
    flags: flagsReducer,
});

export default reducer;
