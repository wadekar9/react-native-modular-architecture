import { combineReducers } from '@reduxjs/toolkit';
import { authSessionReducer } from '@core/auth';
import { flagsReducer } from './slices/flags.slice';
import { authUserReducer } from './slices';

const reducer = combineReducers({
    session: authSessionReducer,
    user: authUserReducer,
    flags: flagsReducer,
});

export default reducer;
