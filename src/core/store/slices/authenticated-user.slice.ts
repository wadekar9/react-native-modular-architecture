import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IAuthUser } from '@core/auth/types';

interface AuthUserState {
    user: IAuthUser | null;
}

const initialState: AuthUserState = {
    user: null,
};

const authUserSlice = createSlice({
    name: 'authUser',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IAuthUser | null>) => {
            state.user = action.payload;
        },
    },
});


export const { setUser } = authUserSlice.actions;
export const authUserReducer = authUserSlice.reducer;
