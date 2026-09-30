import { configureStore } from '@reduxjs/toolkit';
import {
  authRequestReducer,
  authSessionReducer,
  authUserReducer,
  clearSession,
  getAccessToken,
} from '../src/core/auth';
import { login } from '../src/modules/platform/auth/services/auth.api';
import { signInThunk } from '../src/modules/platform/auth/auth.thunks';

jest.mock('../src/modules/platform/auth/services/auth.api', () => ({
  login: jest.fn(),
}));

const mockedLogin = jest.mocked(login);

const createTestStore = () => configureStore({
  reducer: {
    authRequest: authRequestReducer,
    session: authSessionReducer,
    user: authUserReducer,
  },
});

describe('sign-in thunk', () => {
  beforeEach(() => {
    clearSession();
    jest.clearAllMocks();
  });

  it('stores the session and updates auth state when sign-in succeeds', async () => {
    mockedLogin.mockResolvedValue({
      id: 7,
      username: 'demo',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      gender: 'other',
      image: 'https://example.com/avatar.png',
      token: 'access-token',
    });
    const store = createTestStore();

    await store.dispatch(signInThunk({ username: 'demo', password: 'password' }));

    expect(getAccessToken()).toBe('access-token');
    expect(store.getState().session.isSignedIn).toBe(true);
    expect(store.getState().user.user).toMatchObject({
      id: '7',
      email: 'demo@example.com',
      firstName: 'Demo',
    });
    expect(store.getState().authRequest).toMatchObject({
      signInStatus: 'succeeded',
      signInError: null,
    });
  });

  it('exposes request errors and leaves the session signed out when sign-in fails', async () => {
    mockedLogin.mockRejectedValue(new Error('Invalid credentials'));
    const store = createTestStore();

    const action = await store.dispatch(signInThunk({ username: 'demo', password: 'wrong' }));

    expect(signInThunk.rejected.match(action)).toBe(true);
    expect(store.getState().session.isSignedIn).toBe(false);
    expect(store.getState().authRequest).toMatchObject({
      signInStatus: 'failed',
      signInError: 'Invalid credentials',
    });
  });
});