import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * ============================================================================
 * FEATURE FLAGS REDUX SLICE
 * ============================================================================
 *
 * This slice stores application-wide feature flags, typically populated from
 * remote configuration (e.g. Firebase Remote Config, LaunchDarkly, or backend API).
 *
 * HOW IT INTERACTS WITH VERTICALS:
 * 1. DECOUPLED KEY-VALUE STORE:
 *    `ModuleFlags` is intentionally modeled as `Record<string, boolean | undefined>`.
 *    The core store DOES NOT hardcode vertical flag names (e.g., no `foodEnabled: boolean`).
 *    This allows new verticals to be added with arbitrary flag names without editing core types.
 *
 * 2. RUNTIME VERTICAL TOGGLING:
 *    `MainNavigator` subscribes to this slice: `useAppSelector(state => state.flags)`.
 *    When `setFlags` is dispatched, `getActiveVerticals(flags)` re-evaluates:
 *      `vertical.flag === undefined || flags[vertical.flag] === true`
 *    If a flag is set to `false`, that vertical is dynamically unmounted from the tab bar.
 *    If a flag is set to `true`, that vertical is dynamically mounted and its `onRegister`
 *    lifecycle hook is fired.
 *
 * 3. ZERO REBUILD DEPLOYMENTS:
 *    Remote config can instantly disable a buggy vertical in production, or roll out
 *    a new vertical to a percentage of users without requiring an app store release.
 */

export type ModuleFlags = Record<string, boolean | undefined>;

const flagsSlice = createSlice({
  name: 'flags',
  initialState: {} as ModuleFlags,
  reducers: {
    /**
     * Replaces the feature flags map with updated values (e.g., after fetching from remote config).
     */
    setFlags: (_state, action: PayloadAction<ModuleFlags>) => action.payload,
  },
});

export const { setFlags } = flagsSlice.actions;
export const flagsReducer = flagsSlice.reducer;