# CLAUDE.md / claude_code.md - SuperApp Guide

This document provides architectural context, commands, dependency rules, and coding conventions for AI assistants and developers working on this codebase.

---

## 1. Project Overview

* **Type**: React Native Modular SuperApp
* **Frameworks**: React Native 0.86.3, React 19, TypeScript 5.8+
* **State Management**: Redux Toolkit (global session/user/cart) + TanStack React Query (server cache)
* **Storage**: `react-native-mmkv`
* **Navigation**: `@react-navigation/native` (Stack, Bottom Tabs, Material Top Tabs)
* **Backend / Cloud**: Firebase Cloud Messaging (FCM) & Cloud Firestore (`@react-native-firebase`)

---

## 2. Common Commands

```bash
# Start Metro bundler with reset cache
npm start

# Run on Android / iOS
npm run android
npm run ios

# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint check
npm run lint

# Run Jest unit tests
npm test
```

---

## 3. Architecture & Dependency Rules

This project follows a **Strict Layered Vertical-Slice Architecture**. Dependencies must only flow **downwards**:

```text
src/app/         -> Can import: modules, core, shared
src/modules/     -> Can import: core, shared (and platform facade)
src/core/        -> Can import: shared only
src/shared/      -> Can import: NOTHING internal (100% independent)
```

### Folder Responsibilities:

#### `src/shared/` (Design System & Pure Tools)
* **100% Independent**. Reusable across any app.
* **Contains**: UI kit (`BaseButton`, `ThemeText`, `BaseTextInput`, `AppList`), theme tokens (`COLORS`, `typography`), and generic hooks (`useDebounce`, `useAppTheme`, `useAppBackHandler`).
* **Rule**: ❌ Never import from `src/core`, `src/modules`, or `src/app`.

#### `src/core/` (Headless Infrastructure)
* **UI-Agnostic technical foundation**.
* **Contains**:
  * `networking/`: Axios client, interceptors, and `queryClient` singleton.
  * `navigation/`: Headless `navigationRef` and `navigate()` helper.
  * `store/`: Redux store, root reducer, and common slices.
  * `storage/`: MMKV storage wrapper.
  * `notifications/`: FCM push service and `usePushNotifications` hook.
  * `firebase/`: Firebase app, auth, and Firestore instances.
  * `i18n/`: Localization configuration.
* **Rule**: ❌ Never import from `src/modules` or `src/app`.

#### `src/modules/` (Features, Platform & Verticals)
* **`modules/verticals/`**: Micro-apps (`food`, `instamart`, `dineout`, `events`).
  * ❌ Verticals **cannot** import other verticals.
  * Verticals may only import platform capabilities via the facade `@modules/platform`.
* **`modules/platform/`**: Cross-cutting reusable features (`auth`, `profile`, `notifications`, `settings`, `permissions`, `payments`).
  * ❌ Platform modules cannot import from verticals.
* **`registry.ts`**: Vertical registry with feature flags and logout hooks.
  * ❌ Only `src/app/` may import `registry.ts`.

#### `src/app/` (Composition & App Shell)
* Mounts root providers (`SafeAreaProvider`, `AppThemeProvider`, `StoreProvider`, `QueryProvider`).
* Registers `RootNavigator` and manages linking.

---

## 4. Key Architectural Patterns

### Pluggable Vertical Manifest (`ModuleManifest`)
Each vertical exports a manifest in `manifest.ts`:
```ts
const foodManifest: ModuleManifest = {
  id: 'food',
  title: 'Food',
  flag: 'feature_food_enabled', // Optional remote feature flag
  getNavigator: () => require('./navigation/vertical.navigator').default, // Lazy loaded
  deepLinks: {
    screens: {
      RecipeDetails: 'food/recipe/:id',
      FoodCart: 'food/cart',
    },
  },
  onLogout: () => { /* Clear vertical state */ },
};
```

### Dynamic Reducer Injection (`injectReducer`)
Verticals own their state and register domain reducers dynamically without polluting `@core/store`:
```ts
import { injectReducer } from '@core/store/redux.store';
import { cartReducer } from './store/cart.slice';

injectReducer('cart', cartReducer);
```

### Manifest-Driven Deep Linking
The App Shell aggregates deep linking routes dynamically via `getVerticalDeepLinks()` from registered vertical manifests without importing vertical screen constants into `linking.ts`.

### Strategy-Pattern Permission Management
Platform permissions (`@modules/platform/permissions`) use the polymorphic `PermissionManager` and `usePermission(type)` hook with specialized handlers for camera, media, location, and notification.

### Two-Tier Storage Architecture
* **`Storage`** (`@core/storage`): Fast MMKV cache for non-sensitive data and offline state.
* **`SecureStorage`** (`@core/storage`): Hardware/vault-encrypted MMKV for sensitive auth tokens and credentials.

### Network Resilient Queries (`onlineManager`)
TanStack Query is subscribed to `@react-native-community/netinfo` via `setupOnlineManager()` in `@core/networking`, automatically pausing and resuming queries on network transitions.

### Dual-Layer Firestore Sync with Offline Fallback
Services support dual mode:
* **Online**: Reads/writes to Cloud Firestore (`users/{uid}/...`).
* **Offline / Mock fallback**: Uses local MMKV storage (`Storage.set`, `getJson`) if Firebase is not yet configured, ensuring the app works in all environments.

### Decentralized Vertical i18n Registration
Vertical domains own their localization resources (e.g. `src/modules/verticals/food/i18n/` and `src/modules/verticals/dining/i18n/`). Rather than statically polluting `@core/i18n`, domain strings are dynamically registered into i18next via `registerTranslationBundle()` during vertical registration (`onRegister`). Verticals export dedicated domain translation hooks (`useFoodTranslation`, `useDiningTranslation`).

### Pluggable Platform Module Manifests (`PlatformModuleManifest`)
Cross-cutting platform features (`auth`, `location`, `notifications`, `settings`) declare manifests specifying their screens and lazy component loaders (`getComponent`). `RootNavigator` mounts platform screens dynamically from `getPlatformScreens()` rather than statically hardcoding every screen component.

### Domain-Owned Navigation Contracts
Screen route enums and stack parameter lists are decentralized out of `@shared` into domain packages:
* Platform routes (`EAuthScreens`, `ELocationScreens`, `ENotificationScreens`, `ESettingsScreens`) reside in `@modules/platform/*`.
* App shell routes (`ERootScreens.SPLASH`, `ERootScreens.MAIN`) and root `AppStackParamsList` reside in `@app/navigation`.
* `@shared` remains 100% domain-agnostic and free of application-specific routes.


---

## 5. Coding & Style Conventions

1. **Path Aliases**:
   * `@app/*` -> `./src/app/*`
   * `@core/*` -> `./src/core/*`
   * `@modules/*` -> `./src/modules/*`
   * `@shared/*` -> `./src/shared/*`

2. **UI & Theming**:
   * Always use `useAppTheme()` for dynamic colors.
   * Memoize style sheets with `React.useMemo(() => styling(colors), [colors])` to prevent re-allocating styles on re-render.
   * Prefer `<ThemedView>` and `<ThemeText>` for automatic theme adherence.

3. **Linter & Types**:
   * Always check `npx tsc --noEmit` and `npm run lint` before committing.
   * `import/no-cycle` is enforced—never introduce circular dependencies.
   * Follow conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`, `test:`).
