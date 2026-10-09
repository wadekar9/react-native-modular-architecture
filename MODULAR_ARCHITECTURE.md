# Modular (Vertical-Slice) Architecture in React Native
### Enterprise Architectural Blueprint & Implementation Guide

---

## Document Metadata & Baseline Assumptions

* **Architecture Pattern**: Strict Layered Vertical-Slice Architecture (Pluggable Micro-App / SuperApp Pattern)
* **Language**: TypeScript 5.x (Strict Mode)
* **Navigation Engine**: React Navigation (Native Stack, Bottom Tabs, Material Top Tabs)
* **State Management**: Redux Toolkit (with dynamic runtime reducer injection) + TanStack React Query (server cache)
* **Network & Storage**: Axios (singleton with token interceptors) + `react-native-mmkv` (two-tier encrypted storage)
* **Boundary Enforcement**: ESLint (`eslint-plugin-import` with `no-restricted-paths` and `no-cycle`)
* **Target Audience**: Technical Architects, Senior Engineers, Team Leads, and Engineers scaling multi-feature apps

---

## 1. Overview: What Modular Architecture Means in React Native

In standard React Native projects, codebases typically follow a **horizontal layered architecture**:

```text
src/
├── components/      # All UI components from all features
├── screens/         # Every screen in the entire application
├── redux/           # Global reducers, actions, and slices
├── services/        # Every API call merged together
└── utils/           # Helper functions
```

### Why Horizontal Layering Fails at Scale
As a team grows past 4–5 engineers and the app expands beyond 15–20 screens, horizontal layering suffers from:
1. **Low Cohesion & High Coupling**: Modifying a single feature (e.g., checkout) requires changing files in 6 distant folders.
2. **Merge Conflicts**: Multiple teams constantly conflict on shared `rootReducer.ts`, central navigation stacks, and global route enum files.
3. **Bloated Initial Bundle & Degraded Time-to-Interactive (TTI)**: Metro evaluates all screens, heavy native dependencies (e.g., Maps, Camera), and reducers during boot time, even if the user only opens a simple login screen.
4. **Impossible Feature Deletability**: Deleting a legacy feature becomes high-risk because its code, types, and side effects are scattered throughout the codebase.

---

### The Vertical-Slice Solution
A **Modular Vertical-Slice Architecture** partitions an application by **business domains** (vertical micro-apps) rather than technical roles. Each feature module encapsulates its own screens, business logic, UI components, data layer, navigation stack, translations, and state slices:

```text
Feature Vertical: "Payments"
├── components/      # CardInput, PaymentTile (private to payments)
├── screens/         # PaymentMethodScreen, ReceiptScreen
├── services/        # payments.api.ts, payments.queries.ts
├── store/           # payment.slice.ts (injected on-demand)
├── types/           # payment.types.ts
├── i18n/            # Domain localization strings
└── manifest.ts      # Single declarative public contract
```

The application shell interacts with features purely through a declarative contract ([`ModuleManifest`](#4-adding-a-new-vertical-featuremodule)). Features are pluggable, feature-flag gated, lazy-loaded, and completely independent of sibling features.

---

## 2. Root Folder Breakdown & Dependency Hierarchy

The codebase is organized into four strictly segregated tiers with a **downward-only dependency rule**:

```
                       ┌────────────────────────────────────────┐
                       │          src/app (Host Shell)          │
                       └───────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         ▼                                                                   ▼
┌─────────────────────────────────┐                         ┌─────────────────────────────────┐
│     src/modules/verticals       │                         │      src/modules/platform       │
│  (Isolated Domain Micro-Apps)   │ ◄──────[Platform]────── │   (Reusable Domain Services)    │
│  e.g., Payments, Bookings       │         Facade          │   e.g., Auth, Profile, Location │
└────────────────┬────────────────┘                         └────────────────┬────────────────┘
                 │                                                           │
                 └─────────────────────────┬─────────────────────────────────┘
                                           │
                                           ▼
                       ┌────────────────────────────────────────┐
                       │       src/core (Headless Tech)         │
                       │   Networking, Storage, Base Store      │
                       └───────────────────┬────────────────────┘
                                           │
                                           ▼
                       ┌────────────────────────────────────────┐
                       │      src/shared (Pure Primitives)      │
                       │   Design System, Tokens, Pure Utils    │
                       └────────────────────────────────────────┘
```

### Dependency Rules Matrix

| Layer | Can Import From | Must NEVER Import From |
| :--- | :--- | :--- |
| **`src/app/`** | `src/modules/`, `src/core/`, `src/shared/` | *None (Top-level shell)* |
| **`src/modules/`** | `src/core/`, `src/shared/`, `@modules/platform` (facade) | `src/app/`, sibling verticals |
| **`src/core/`** | `src/shared/` only | `src/app/`, `src/modules/` |
| **`src/shared/`** | External dependencies only (100% pure) | `src/app/`, `src/modules/`, `src/core/` |

---

### Detailed Folder Responsibilities

### 2.1 `src/app/` (Application Shell & Composition Root)
* **Purpose**: Mounts the app runtime, registers root providers, and boots navigation.
* **What Belongs**:
  * Root component (`App.tsx`).
  * Provider assembly (`QueryProvider`, `StoreProvider`, `ThemeProvider`).
  * Root navigation shell (`RootNavigator`, dynamic tab switcher, deep link configuration).
* **What Must NOT Belong**:
  * Feature-specific screens, business logic, or domain reducers.
  * API endpoints or domain types.
* **Interactions**: Imports manifests and registries from `src/modules/`, store and network singletons from `src/core/`, and top-level theme providers from `src/shared/`.

### 2.2 `src/modules/` (Business Domains & Platform Capabilities)
Divided into two sub-categories:
1. **`modules/verticals/`**: Self-contained business domains (e.g., `payments`, `bookings`, `orders`).
   * Verticals **never** import sibling verticals directly.
   * Verticals expose only a `manifest.ts`.
2. **`modules/platform/`**: Cross-cutting domain capabilities (e.g., `auth`, `profile`, `notifications`, `location`).
   * Verticals consume platform features exclusively through the unified facade `@modules/platform`.
* **What Belongs**: Feature screens, private components, domain queries, localized state, validation schemas, manifests.
* **What Must NOT Belong**: Core infrastructure singletons, app-level bootstrap code, or domain-agnostic UI kit components.

### 2.3 `src/core/` (Headless Technical Infrastructure)
* **Purpose**: Provides UI-agnostic technical capabilities to the rest of the app.
* **What Belongs**:
  * `networking/`: Axios client, interceptors, `queryClient` singleton, network reconnect manager.
  * `storage/`: Fast MMKV key-value storage and encrypted secure storage wrappers.
  * `store/`: Base Redux store instance, static baseline slices (`session`, `flags`), and `injectReducer()` dynamic registry.
  * `navigation/`: Headless `navigationRef` and imperative `navigate()` service.
  * `permissions/`: Polymorphic permission manager (camera, location, notifications).
  * `i18n/`: Base i18next engine and `registerTranslationBundle()` helper.
* **What Must NOT Belong**:
  * JSX components, feature screens, domain-specific strings, or business reducers.
* **Interactions**: Pure foundation consumed by `modules` and `app`. Can only import domain-agnostic helpers from `shared`.

### 2.4 `src/shared/` (Design System & Pure Primitives)
* **Purpose**: Universal building blocks reusable across any React Native app.
* **What Belongs**:
  * `components/ui/`: Design System (`BaseButton`, `BaseTextInput`, `ThemeText`, `ThemedView`, `Skeleton`).
  * `theme/`: Color palettes, typography scales, dynamic dark/light theme context.
  * `constants/`: Spacing tokens, border radii, responsive scale helpers (`moderateScale`).
  * `hooks/`: Generic UI hooks (`useDebounce`, `useAppTheme`, `useAppBackHandler`).
  * `utils/`: Date formatting, currency parsing, regex validators.
* **What Must NOT Belong**:
  * Route enums, feature screen names, app navigation param lists, domain types, or API services.
* **Interactions**: **100% Independent**. Zero internal project imports.

---

## 3. Automated Architectural Guardrails (ESLint Configuration)

Architecture diagrams without automated enforcement inevitably decay. Use `eslint-plugin-import` and `import/no-restricted-paths` to break the build if boundaries are violated:

```javascript
// .eslintrc.js
const fs = require('fs');
const path = require('path');

const verticalRoot = path.join(__dirname, 'src/modules/verticals');
const verticalNames = fs.existsSync(verticalRoot)
  ? fs.readdirSync(verticalRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
  : [];

// Rule: Verticals cannot depend on sibling verticals
const verticalIsolationZones = verticalNames.map(vertical => ({
  target: verticalNames
    .filter(other => other !== vertical)
    .map(other => `./src/modules/verticals/${other}`),
  from: `./src/modules/verticals/${vertical}`,
  message: 'Vertical isolation violation: Verticals cannot import sibling verticals.',
}));

module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['import'],
  rules: {
    'import/no-cycle': 'error',
    'import/no-restricted-paths': ['error', {
      basePath: __dirname,
      zones: [
        // 1. Shared cannot import app, core, or modules
        {
          target: './src/shared',
          from: ['./src/app', './src/core', './src/modules'],
          message: 'Shared code must be 100% independent.',
        },
        // 2. Core cannot import app or modules
        {
          target: './src/core',
          from: ['./src/app', './src/modules'],
          message: 'Core technical infrastructure cannot import modules or app.',
        },
        // 3. Modules cannot import app
        {
          target: './src/modules',
          from: './src/app',
          message: 'Modules cannot depend on the host app shell.',
        },
        // 4. Registry may only be imported by app
        {
          target: ['./src/core', './src/shared', './src/modules'],
          from: './src/modules/registry.ts',
          message: 'Only app shell may import the module registry.',
        },
        // 5. Platform cannot depend on verticals
        {
          target: './src/modules/platform',
          from: './src/modules/verticals',
          message: 'Platform modules cannot depend on verticals.',
        },
        // 6. Cross-vertical isolation
        ...verticalIsolationZones,
      ],
    }],
  },
};
```

---

## 4. The Manifest Contract Pattern

A vertical communicates with the host application through a single typed interface.

```typescript
// src/modules/module.types.ts
import type { ComponentType } from 'react';

export type ModuleManifest = {
  /** Unique domain identifier (e.g. 'payments', 'notifications') */
  id: string;

  /** Display title for headers and dynamic tab bars */
  title: string;

  /** Optional remote config / Redux flag to gate module activation */
  flag?: string;

  /**
   * Lazy Navigation Loader.
   * Defers bundling and evaluating screens until user navigates to the vertical.
   */
  getNavigator: () => ComponentType<any>;

  /** Deep link route schema mapping for URL routing */
  deepLinks?: Record<string, string>;

  /** Lifecycle Hook: Invoked when module is activated (e.g., dynamic reducer injection) */
  onRegister?: () => void;

  /** Lifecycle Hook: Invoked on user logout to purge private caches and state */
  onLogout?: () => void;
};
```

---

## 5. Adding a New Vertical Feature/Module (Step-by-Step)

Let's build a concrete **`payments`** vertical module from scratch.

### Step 5.1: Scaffold the Module Directory
```bash
mkdir -p src/modules/verticals/payments/{components,constants,hooks,i18n/locales,navigation,screens,services,store,types}
```

---

### Step 5.2: Define Domain Types and Route Enums

```typescript
// src/modules/verticals/payments/constants/screens.constants.ts
export enum EPaymentsScreens {
  PAYMENT_METHODS = 'PaymentMethods',
  ADD_CARD = 'AddCard',
  PAYMENT_CONFIRMATION = 'PaymentConfirmation',
}
```

```typescript
// src/modules/verticals/payments/types/navigation.types.ts
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { EPaymentsScreens } from '../constants/screens.constants';

export type PaymentsStackParamsList = {
  [EPaymentsScreens.PAYMENT_METHODS]: undefined;
  [EPaymentsScreens.ADD_CARD]: undefined;
  [EPaymentsScreens.PAYMENT_CONFIRMATION]: { transactionId: string };
};

export type PaymentsScreenProps<T extends keyof PaymentsStackParamsList> =
  NativeStackScreenProps<PaymentsStackParamsList, T>;

export type PaymentsNavigationProps = NativeStackNavigationProp<PaymentsStackParamsList>;
```

---

### Step 5.3: Implement Module-Owned Localization

Store translations directly within the feature module:

```json
// src/modules/verticals/payments/i18n/locales/en.json
{
  "TITLE": "Payment Methods",
  "ADD_NEW_CARD": "Add Credit or Debit Card",
  "SECURE_PAYMENT": "100% Encrypted Transactions",
  "CONFIRMATION_TITLE": "Payment Successful"
}
```

```typescript
// src/modules/verticals/payments/i18n/index.ts
import en from './locales/en.json';
import { registerTranslationBundle } from '@core/i18n';

export const registerPaymentsTranslations = (): void => {
  registerTranslationBundle('payments', { en });
};
```

```typescript
// src/modules/verticals/payments/hooks/use-payments-translation.hook.ts
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { registerPaymentsTranslations } from '../i18n';

registerPaymentsTranslations();

export const usePaymentsTranslation = () => {
  const { t, i18n } = useTranslation('payments');
  const payments_t = useCallback(
    (key: string, options?: Record<string, unknown>): string => t(key, options) as string,
    [t]
  );
  return { payments_t, i18n };
};
```

---

### Step 5.4: Implement Domain Reducer (Dynamic Injection)

```typescript
// src/modules/verticals/payments/store/payments.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PaymentMethod = { id: string; last4: string; brand: string };

type PaymentsState = {
  methods: PaymentMethod[];
  defaultMethodId?: string;
};

const initialState: PaymentsState = {
  methods: [],
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.methods.push(action.payload);
    },
    clearPaymentsState() {
      return initialState;
    },
  },
});

export const { addPaymentMethod, clearPaymentsState } = paymentsSlice.actions;
export const paymentsReducer = paymentsSlice.reducer;
```

---

### Step 5.5: Implement Navigation Stack

```typescript
// src/modules/verticals/payments/navigation/payments.stack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EPaymentsScreens } from '../constants/screens.constants';
import type { PaymentsStackParamsList } from '../types/navigation.types';
import PaymentMethodsScreen from '../screens/payment-methods.screen';
import AddCardScreen from '../screens/add-card.screen';

const Stack = createNativeStackNavigator<PaymentsStackParamsList>();

const PaymentsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={EPaymentsScreens.PAYMENT_METHODS} component={PaymentMethodsScreen} />
    <Stack.Screen name={EPaymentsScreens.ADD_CARD} component={AddCardScreen} />
  </Stack.Navigator>
);

export default PaymentsStack;
```

---

### Step 5.6: Export the Module Manifest

The `manifest.ts` is the **only entry point** exposed to the outside application:

```typescript
// src/modules/verticals/payments/manifest.ts
import type { ModuleManifest } from '@modules/module.types';
import store, { injectReducer } from '@core/store/redux.store';
import { paymentsReducer, clearPaymentsState } from './store/payments.slice';
import { registerPaymentsTranslations } from './i18n';
import { EPaymentsScreens } from './constants/screens.constants';

const paymentsManifest: ModuleManifest = {
  id: 'payments',
  title: 'Payments',
  flag: 'feature_payments_enabled', // Remote config flag key

  onRegister: () => {
    // 1. Register domain translations
    registerPaymentsTranslations();
    // 2. Dynamically attach domain reducer to global store
    injectReducer('payments', paymentsReducer);
  },

  // Lazy evaluation: Navigators are required on-demand
  getNavigator: () => require('./navigation/payments.stack').default,

  deepLinks: {
    screens: {
      [EPaymentsScreens.PAYMENT_METHODS]: 'payments/methods',
      [EPaymentsScreens.ADD_CARD]: 'payments/add-card',
    },
  },

  onLogout: () => {
    // Session teardown: Purge private card details on user sign-out
    store.dispatch(clearPaymentsState());
  },
};

export default paymentsManifest;
```

---

### Step 5.7: Register in the Central Registry

Add the manifest to the central vertical registry:

```typescript
// src/modules/registry.ts
import type { ModuleManifest } from './module.types';
import paymentsManifest from './verticals/payments/manifest';

export const verticals: ModuleManifest[] = [
  paymentsManifest,
];
```

**Result**: That is all. The `payments` feature is now:
- Lazily loaded when navigated to.
- Feature-flag gated by `state.flags.feature_payments_enabled`.
- Injected with isolated Redux state and translations.
- Cleared automatically on user logout.
- Mountable in the host dynamic tab bar or deep link resolver without altering `RootNavigator.tsx`.

---

## 6. Removing an Existing Module (Zero-Residual Cleanup)

Because the architecture enforces strict decoupled contracts, removing a vertical takes under 2 minutes:

### Deletion Checklist:
1. **Unregister Manifest**: Remove the vertical's manifest entry from `src/modules/registry.ts`.
2. **Delete Feature Directory**: Run `rm -rf src/modules/verticals/<module-name>`.
3. **Verify Build & Boundaries**:
   ```bash
   npx tsc --noEmit
   npm run lint
   npm test
   ```
4. **Why this works seamlessly**: Because core navigators, the root store, and sibling features never held static imports to `<module-name>`, deleting the folder produces **zero dangling references** or broken compile errors.

---

## 7. Navigation Architecture & Route Separation

```
                    ┌────────────────────────────────────────┐
                    │             RootNavigator              │
                    │   (Auth, Splash, Platform Screens)     │
                    └───────────────────┬────────────────────┘
                                        │
                                        ▼ (Signed In)
                    ┌────────────────────────────────────────┐
                    │             MainNavigator              │
                    │         (Dynamic Top/Bottom Tab)       │
                    └───────┬────────────────────────┬───────┘
                            │                        │
         (Loaded Lazily)    │                        │    (Loaded Lazily)
                            ▼                        ▼
               ┌────────────────────────┐┌────────────────────────┐
               │     PaymentsStack      ││     BookingsStack      │
               │ (Internal Native Stack)││ (Internal Native Stack)│
               └────────────────────────┘└────────────────────────┘
```

### 7.1 Separation of Navigation Concerns
1. **Root Stack (`RootNavigator.tsx`)**: Hosts app bootstrap (`Splash`), authentication screens, full-screen platform modals, and the authenticated `MainNavigator`.
2. **Shell Tab Navigator (`MainNavigator.tsx`)**: Consumes `getActiveVerticals(flags)` and maps over active manifests using `getComponent={vertical.getNavigator}` with `lazy: true`.
3. **Module Stacks (`<vertical>.stack.tsx`)**: Completely private to each vertical. Route names inside `PaymentsStack` are invisible to and independent of `BookingsStack`.

### 7.2 Headless Cross-Module Navigation
When a module needs to trigger navigation to another domain (e.g., checkout navigating to user address profile), modules must **not** import route enums across vertical boundaries. Use the headless navigation service or deep links:

```typescript
// src/core/navigation/navigation.service.ts
import { createNavigationContainerRef, type ParamListBase } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<ParamListBase>();

export function navigate(name: string, params?: Record<string, unknown>): void {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as any)(name, params);
  }
}
```

```typescript
// Invocation from inside any feature without tight coupling:
import { navigate } from '@core/navigation';

navigate('LiveTracking', { orderId: 'ord_123' });
```

---

## 8. Networking & Data Layer

```
┌────────────────────────────────────────────────────────┐
│               src/core/networking                      │
│  - Axios Client Singleton with Interceptors            │
│  - Refresh Token Mutex Queue                           │
│  - TanStack Query Client                               │
│  - NetInfo Online Reconnect Manager                    │
└───────────────────────────┬────────────────────────────┘
                            │ (Injected HTTP Client)
         ┌──────────────────┴──────────────────┐
         ▼                                     ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│  modules/payments/services  │   │  modules/bookings/services  │
│  - payments.api.ts          │   │  - bookings.api.ts          │
│  - payments.queries.ts      │   │  - bookings.queries.ts      │
│  - payments.keys.ts         │   │  - bookings.keys.ts         │
└─────────────────────────────┘   └─────────────────────────────┘
```

### 8.1 Headless Core Networking Singleton
Core provides the single, hardened Axios instance with automatic bearer token injection and response normalization:

```typescript
// src/core/networking/axios-instance.ts
import axios from 'axios';
import { SecureStorage } from '@core/storage';

export const axiosInstance = axios.create({
  baseURL: 'https://api.example.com/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(async config => {
  const token = SecureStorage.getString('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 8.2 Domain Query Keys Factory Pattern
To prevent query cache collision across features, each module uses a localized Query Key Factory:

```typescript
// src/modules/verticals/payments/services/payments.keys.ts
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  detail: (id: string) => [...paymentKeys.all, 'detail', id] as const,
};
```

```typescript
// src/modules/verticals/payments/services/payments.queries.ts
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@core/networking';
import { paymentKeys } from './payments.keys';
import type { PaymentMethod } from '../types/payment.types';

export const usePaymentMethodsQuery = () => {
  return useQuery({
    queryKey: paymentKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get<PaymentMethod[]>('/payments/methods');
      return response.data;
    },
  });
};
```

---

## 9. State Management: Dynamic Reducer Injection

To prevent an oversized static `rootReducer` that bundles all features upfront, the Redux store uses a **runtime injection pattern**:

```typescript
// src/core/store/redux.store.ts
import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';
import { authSessionReducer, flagsReducer } from './static-slices';

const staticReducers = {
  session: authSessionReducer,
  flags: flagsReducer,
};

const asyncReducers: Record<string, Reducer<any>> = {};

const createRootReducer = () =>
  combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });

const store = configureStore({
  reducer: createRootReducer(),
});

/**
 * Dynamically mounts an asynchronous reducer slice into the active Redux store.
 */
export const injectReducer = (key: string, asyncReducer: Reducer<any>): void => {
  if (!asyncReducers[key]) {
    asyncReducers[key] = asyncReducer;
    store.replaceReducer(createRootReducer());
  }
};

export default store;
```

---

## 10. Comprehensive Testing Strategy

Modular architecture simplifies testing by establishing clean boundaries for isolation:

```
Test Pyramid in Modular Architecture:
┌──────────────────────────────────────────────┐
│           E2E Smoke Tests (App Flow)         │
├──────────────────────────────────────────────┤
│    Module Integration & Registry Tests       │
├──────────────────────────────────────────────┤
│  Unit Tests: Slices, Queries, Hooks, Utils   │
└──────────────────────────────────────────────┘
```

### 10.1 Unit Testing Feature Slices in Absolute Isolation
Because feature reducers do not depend on the global state tree, they can be tested as pure functions:

```typescript
// __tests__/payments.slice.test.ts
import { paymentsReducer, addPaymentMethod, clearPaymentsState } from '../src/modules/verticals/payments/store/payments.slice';

describe('Payments Domain Reducer', () => {
  it('appends a payment method', () => {
    const initialState = { methods: [] };
    const nextState = paymentsReducer(
      initialState,
      addPaymentMethod({ id: 'pm_1', brand: 'visa', last4: '4242' })
    );

    expect(nextState.methods).toHaveLength(1);
    expect(nextState.methods[0].last4).toBe('4242');
  });

  it('resets state on clear', () => {
    const activeState = { methods: [{ id: 'pm_1', brand: 'visa', last4: '4242' }] };
    const cleared = paymentsReducer(activeState, clearPaymentsState());
    expect(cleared.methods).toHaveLength(0);
  });
});
```

### 10.2 Architectural Contract & Lazy Loading Tests
Automate verification that importing manifests does not eagerly evaluate heavy screen components:

```typescript
// __tests__/module-registry.test.ts
const mockPaymentsNavigatorLoaded = jest.fn();
jest.mock('../src/modules/verticals/payments/navigation/payments.stack', () => {
  mockPaymentsNavigatorLoaded();
  return { __esModule: true, default: () => null };
});

import { verticals, getActiveVerticals, runLogoutHooks } from '../src/modules/registry';

describe('Module Registry Integrity', () => {
  it('keeps vertical navigators lazily evaluated on boot', () => {
    // Asserting that importing manifests did NOT execute the stack navigator
    expect(mockPaymentsNavigatorLoaded).not.toHaveBeenCalled();
  });

  it('gates modules according to feature flags', () => {
    const active = getActiveVerticals({ feature_payments_enabled: false });
    expect(active.some(m => m.id === 'payments')).toBe(false);

    const enabled = getActiveVerticals({ feature_payments_enabled: true });
    expect(enabled.some(m => m.id === 'payments')).toBe(true);
  });
});
```

---

## 11. Complete Sample Project Folder Structure

```text
SuperApp/
├── .eslintrc.js                   # Automated boundary zones
├── package.json                   # Workspaces descriptor
├── tsconfig.json                  # Path aliases (@app, @modules, @core, @shared)
├── src/
│   ├── app/                       # Composition Root (Shell)
│   │   ├── App.tsx                # App entrypoint
│   │   ├── navigation/
│   │   │   ├── root-navigator.tsx # Mounts splash, auth, and dynamic tabs
│   │   │   ├── main-navigator.tsx # Dynamic vertical tabs
│   │   │   ├── linking.ts         # Aggregated deep links
│   │   │   └── navigation.types.ts# Root param list
│   │   └── providers/             # StoreProvider, QueryProvider, ThemeProvider
│   │
│   ├── modules/                   # Domain Features Layer
│   │   ├── module.types.ts        # ModuleManifest contract
│   │   ├── registry.ts            # Central feature discovery hub
│   │   ├── platform/              # Cross-Cutting Capabilities
│   │   │   ├── auth/              # Login, register, session
│   │   │   ├── profile/           # User details, settings
│   │   │   ├── notifications/     # FCM, notification inbox
│   │   │   └── index.ts           # Unified platform facade
│   │   └── verticals/             # Isolated Business Domains
│   │       ├── dining/          # Feature 1
│   │       │   ├── components/    # Feature-specific UI
│   │       │   ├── constants/     # Screen enums
│   │       │   ├── hooks/         # Custom domain hooks
│   │       │   ├── i18n/          # Feature translations
│   │       │   ├── navigation/    # dining.stack.tsx
│   │       │   ├── screens/       # Payment screens
│   │       │   ├── services/      # API queries & endpoints
│   │       │   ├── store/         # dining.slice.ts
│   │       │   ├── types/         # Domain & navigation types
│   │       │   └── manifest.ts    # Single public integration contract
│   │       └── food/          # Feature 2 (Identical anatomy)
│   │
│   ├── core/                      # Headless Technical Foundation
│   │   ├── networking/            # Axios instance, queryClient, onlineManager
│   │   ├── storage/               # MMKV Storage & SecureStorage
│   │   ├── store/                 # Base store, static slices, injectReducer
│   │   ├── navigation/            # navigationRef, headless navigate() helper
│   │   ├── permissions/           # Permission manager strategy
│   │   └── i18n/                  # i18next instance, registerTranslationBundle
│   │
│   └── shared/                    # Design System & Pure Utilities
│       ├── components/ui/         # BaseButton, ThemeText, Skeleton, Inputs
│       ├── constants/             # COLORS, SPACING, RADIUS, moderateScale
│       ├── hooks/                 # useAppTheme, useDebounce, useBackHandler
│       ├── styles/                # Typography, flexbox styles
│       ├── theme/                 # AppTheme context & provider
│       └── utils/                 # Currency, date, formatting helpers
```

---

## 12. Best Practices & Common Pitfalls

| Category | Best Practice | Common Anti-Pattern / Pitfall |
| :--- | :--- | :--- |
| **Shared Folder** | Keep `src/shared` 100% domain-agnostic. Store only primitives, UI tokens, and generic helpers. | Treating `shared/` as a dumping ground for feature constants, app route enums, or business types. |
| **Cross-Module Comms** | Communicate across modules via headless events, `@modules/platform` facade, or deep links. | Directly importing files from `../verticals/other-feature` (breaks independent deployability). |
| **Startup Performance** | Always use `getNavigator: () => require(...).default` to defer bundle evaluation. | Eagerly importing vertical stack navigators in `registry.ts` or `MainNavigator.tsx`. |
| **State Management** | Dynamically inject feature reducers (`injectReducer`) on feature activation. | Hardcoding domain reducers (`paymentsReducer`, `bookingReducer`) in the static `core/store`. |
| **Localization** | Co-locate translation files in `modules/<feature>/i18n` and register dynamically. | Hardcoding all domain strings in a monolithic `core/locales/en.json`. |
| **Enforcement** | Run `npm run lint` with `import/no-restricted-paths` on git pre-commit hooks and CI. | Relying on verbal agreements or wiki guidelines without automated lint checks. |

---

## 13. Pros and Cons: Architectural Trade-Off Analysis

### The Pros
* **Zero Merge Conflicts**: Feature teams build, update, and delete verticals without touching shared root files.
* **Instant Feature Flagging**: Modules turn on and off based on remote feature flags without conditional JSX trees.
* **Optimized TTI**: Metro defers loading screens and heavy dependencies until the user actually opens the vertical.
* **Effortless Teardown**: Deleting a feature is as simple as removing its manifest from `registry.ts` and deleting its folder.
* **High Testability**: Slices, services, and components can be tested in pure isolation without bootstrapping the app.

### The Cons
* **Initial Setup Ceremony**: Requires setting up manifests, boundary rules, and path aliases upfront.
* **Overkill for Small Apps**: For a simple application with 5–10 screens and 1–2 developers, this structure introduces unnecessary abstraction.
* **Dynamic Typing Overhead**: Dynamically injected Redux slices require optional typing (`state.payments?: PaymentsState`) in root state types.
* **Cross-Feature Friction**: Engineers cannot quickly "reach across" to import code from another feature; they must design a platform abstraction or deep link.

---

### Summary Checklist for New Feature Work
When implementing any feature in this architecture, follow this mental model:
1. *Is it a domain micro-app?* $\rightarrow$ Put it in `src/modules/verticals/<name>`.
2. *Is it a reusable cross-cutting service (Auth, Location)?* $\rightarrow$ Put it in `src/modules/platform/<name>`.
3. *Is it a technical, UI-agnostic foundation (Storage, Network)?* $\rightarrow$ Put it in `src/core/<name>`.
4. *Is it a pure, brand-level UI primitive (Button, Typography, Spacing)?* $\rightarrow$ Put it in `src/shared/<name>`.
5. *Is it app bootstrap, root linking, or provider assembly?* $\rightarrow$ Put it in `src/app/`.

