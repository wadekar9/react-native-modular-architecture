# Modular (Vertical-Slice) Architecture in React Native
### Enterprise Engineering Blueprint & Reference Guide

---

## Document Metadata & Baseline Assumptions

* **Architecture Pattern**: Strict Layered Vertical-Slice Architecture (Pluggable Micro-App / SuperApp Pattern)
* **Language**: TypeScript 5.x (Strict Mode: `"strict": true`)
* **Navigation Engine**: React Navigation (v6 / v7 Native Stack, Bottom Tabs, Material Top Tabs) with lazy-evaluated navigators
* **State Management**: Dual-tier:
  * **Server State**: TanStack React Query v5 (scoped query key factories per module)
  * **Client / UI State**: Redux Toolkit (base core store with dynamic runtime reducer injection via `injectReducer`) + local React state
* **Network & Storage**: Axios client singleton with token refresh mutex interceptors + `react-native-mmkv` (two-tier encrypted persistence)
* **Boundary Enforcement**: ESLint (`eslint-plugin-import` with `no-restricted-paths` and `no-cycle`)
* **Target Audience**: Technical Architects, Senior Engineers, Team Leads, and Squad Engineers scaling multi-feature apps

---

## 1. Overview: What Modular Architecture Means in React Native

In standard React Native projects, codebases typically start with a **horizontal layered architecture**:

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
1. **Low Cohesion & High Coupling**: Modifying a single feature (e.g., food ordering or event booking) requires changing files in 6 distant folders.
2. **Merge Conflicts**: Multiple teams constantly conflict on shared `rootReducer.ts`, central navigation stacks, and global route enum files.
3. **Bloated Initial Bundle & Degraded Time-to-Interactive (TTI)**: Metro evaluates all screens, heavy native dependencies (e.g., Maps, Camera), and reducers during boot time, even if the user only opens a simple login screen.
4. **Impossible Feature Deletability**: Deleting a legacy feature becomes high-risk because its code, types, and side effects are scattered throughout the codebase.

---

### The Vertical-Slice Solution
A **Modular Vertical-Slice Architecture** partitions an application by **business domains** (vertical micro-apps) rather than technical roles. Each feature module encapsulates its own screens, business logic, UI components, data layer, navigation stack, translations, and state slices:

```text
Feature Vertical: "food"
├── components/      # DishCard, CategoryFilterBadge (private to food)
├── constants/       # Screen enums, category constants
├── hooks/           # useFoodDetails, useFoodFilter
├── i18n/            # en.json, ar.json
├── navigation/      # food.navigator.tsx, food.routes.ts
├── screens/         # FoodListScreen, FoodDetailScreen
├── services/        # food.api.ts, food.queries.ts, food.keys.ts
├── store/           # food.slice.ts (injected on-demand)
├── types/           # food.types.ts
└── manifest.ts      # Single declarative public contract
```

The application shell interacts with features purely through a declarative contract ([`ModuleManifest`](#5-the-manifest-contract-pattern)). Features are pluggable, feature-flag gated, lazy-loaded, and completely independent of sibling features.

---

## 2. Vertical vs. Horizontal Structure

### How the Two Differ
* **Horizontal Architecture** organizes code by **technical artifact** (what the file *is*: a component, a screen, a service, or a slice).
* **Vertical Architecture** organizes code by **business capability** (what the file *does*: food delivery, events booking, billing, or authentication).

```
HORIZONTAL: "Group by Technical Role"         VERTICAL: "Group by Business Domain"
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│  src/components/ (All features)      │     │  src/modules/verticals/food/         │
│  src/screens/    (All features)      │     │  src/modules/verticals/events/       │
│  src/services/   (All features)      │     │  src/modules/platform/auth/          │
│  src/store/      (All features)      │     │  src/core/ (Headless Tech)           │
│  src/navigation/ (Monolithic routes) │     │  src/shared/ (Design System)         │
└──────────────────────────────────────┘     └──────────────────────────────────────┘
```

---

### Side-by-Side Folder Tree Comparison

Consider a representative mobile application featuring **Auth**, **Notifications**, **Food**, and **Events**.

#### Horizontal (Layer-Based) Organization
```text
src/
├── components/
│   ├── Button.tsx
│   ├── DishCard.tsx                 # Belongs to Food domain
│   ├── CategoryFilterBadge.tsx      # Belongs to Food domain
│   ├── EventCard.tsx                # Belongs to Events domain
│   └── NotificationRow.tsx          # Belongs to Notifications domain
├── screens/
│   ├── LoginScreen.tsx              # Belongs to Auth domain
│   ├── ForgotPasswordScreen.tsx     # Belongs to Auth domain
│   ├── FoodListScreen.tsx           # Belongs to Food domain
│   ├── FoodDetailScreen.tsx         # Belongs to Food domain
│   ├── EventsListScreen.tsx         # Belongs to Events domain
│   ├── EventDetailScreen.tsx        # Belongs to Events domain
│   └── NotificationsScreen.tsx      # Belongs to Notifications domain
├── navigation/
│   ├── AppNavigator.tsx             # Monolithic stack registering ALL screens
│   ├── TabsNavigator.tsx            # Hardcoded tab bars
│   └── types.ts                     # Every screen param mixed into one type
├── services/
│   ├── api.ts                       # Shared Axios instance
│   ├── auth.service.ts
│   ├── food.service.ts
│   ├── events.service.ts
│   └── notifications.service.ts
├── store/
│   ├── rootReducer.ts               # Statically imports EVERY slice upfront
│   ├── authSlice.ts
│   ├── foodSlice.ts
│   └── eventsSlice.ts
└── utils/
    ├── dateUtils.ts
    ├── formatCurrency.ts
    └── foodPriceCalculations.ts     # Domain logic mixed into generic utils
```

#### Vertical (Modular-Slice) Organization
```text
src/
├── app/                             # Application Shell & Composition Root
│   ├── App.tsx                      # Mounts root providers & entry point
│   └── navigation/
│       ├── root-navigator.tsx       # Auth gate, platform screens & shell tabs
│       └── navigation.types.ts      # Root-level navigation contracts
│
├── modules/                         # Business Domains & Platform Capabilities
│   ├── registry.ts                  # Central feature discovery hub
│   ├── module.types.ts              # Declarative ModuleManifest contract
│   │
│   ├── platform/                    # Reusable Domain & Platform Capabilities
│   │   ├── auth/                    # Login, signup, password reset
│   │   │   ├── components/          # LoginForm, SocialAuthButtons
│   │   │   ├── constants/           # Auth screen enums, storage keys
│   │   │   ├── hooks/               # useAuth, useSession
│   │   │   ├── navigation/          # auth.navigator.tsx
│   │   │   ├── screens/             # LoginScreen, ForgotPasswordScreen
│   │   │   ├── services/            # auth.api.ts
│   │   │   ├── store/               # session.slice.ts
│   │   │   ├── types/               # auth.types.ts
│   │   │   └── manifest.ts          # Platform module manifest
│   │   ├── location/                # GPS permissions, address picker
│   │   ├── notifications/           # Push inbox, notification settings
│   │   ├── settings/                # App preferences, language switcher
│   │   ├── routes.ts                # Platform route name constants
│   │   └── index.ts                 # Unified @modules/platform public facade
│   │
│   └── verticals/                   # Independent Business Micro-Apps
│       ├── food/                    # Food Vertical (Self-Contained)
│       │   ├── components/          # DishCard, CategoryBadge (private)
│       │   ├── constants/           # Screen enums, dish status constants
│       │   ├── hooks/               # useFoodDetails, useFoodFilter
│       │   ├── i18n/                # en.json, ar.json
│       │   ├── navigation/          # food.navigator.tsx, food.routes.ts
│       │   ├── screens/             # FoodListScreen, FoodDetailScreen
│       │   ├── services/            # food.api.ts, food.queries.ts, food.keys.ts
│       │   ├── store/               # food.slice.ts (dynamically injected)
│       │   ├── types/               # food.types.ts, navigation.types.ts
│       │   └── manifest.ts          # Single public integration contract
│       │
│       └── events/                  # Events Vertical (Self-Contained)
│           ├── components/          # EventCard, TicketModal
│           ├── constants/           # Screen enums
│           ├── navigation/          # events.navigator.tsx
│           ├── screens/             # EventsListScreen, EventDetailScreen
│           ├── services/            # events.api.ts
│           ├── types/               # events.types.ts
│           └── manifest.ts          # Public integration contract
│
├── core/                            # Headless Technical Infrastructure
│   ├── networking/                  # Axios singleton, auth interceptors, queryClient
│   ├── storage/                     # MMKV storage & secure keychain wrappers
│   ├── store/                       # Base Redux store + injectReducer engine
│   └── i18n/                        # Base i18next engine + dynamic bundle loader
│
└── shared/                          # 100% Pure Domain-Agnostic UI & Primitives
    ├── components/                  # BaseButton, TextInput, Card, Modal, Typography
    ├── theme/                       # Colors, Spacing, Typography tokens
    ├── hooks/                       # useDebounce, useAppTheme, useKeyboard
    └── utils/                       # formatCurrency, formatDate, validation
```

---

### What Changes in Day-to-Day Work

| Aspect | Horizontal Architecture | Vertical-Slice Architecture | Impact on Team |
| :--- | :--- | :--- | :--- |
| **Finding Code** | **High cognitive load**. To inspect the Food feature, an engineer jumps between `screens/`, `components/`, `services/`, `store/`, and `navigation/`. | **Zero context-switching**. Everything related to `food` lives inside `src/modules/verticals/food/`. Opening one folder reveals its entire lifecycle. | Reduces developer ramp-up time and context-switching fatigue. |
| **Making a Change** | **Broad blast radius**. Updating `DishCard` inside `src/components/` creates risk of breaking other screens. Changes touch 5–10 files across the tree. | **Contained blast radius**. Components inside `food/components/` are private to `food`. Editing them cannot break sibling features. | Drastically lowers regression risk during feature iteration. |
| **Code Ownership** | **Ambiguous ownership**. Central files (`rootReducer.ts`, `AppNavigator.tsx`, shared services) are edited by all developers simultaneously, creating frequent Git merge conflicts. | **Clear squad boundaries**. Squad Food owns `src/modules/verticals/food/**`. Pull requests are isolated to domain folders, with zero merge conflicts on release branches. | Eliminates cross-team PR blockers and release bottlenecks. |
| **Pull Requests** | PRs contain files scattered throughout the repository, making code reviews tedious and hard to follow. | PRs are compact, clean, and contained within a single vertical slice directory. | Speeds up review cycles and makes regressions obvious. |
| **Feature Deletion** | **High-risk audit**. Deleting a feature requires hunting down scattered components, routes, services, and reducers. Dead code is often left behind. | **Zero-effort teardown**. Remove the manifest entry from `registry.ts` and delete the directory. The app continues compiling cleanly. | Enables aggressive product experimentation and painless feature deprecation. |

---

## 3. Root Folder Breakdown & Dependency Hierarchy

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
│  e.g., food, events, billing    │         Facade          │   e.g., auth, location, settings│
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
| **`src/modules/verticals/`** | `src/core/`, `src/shared/`, `@modules/platform` (facade) | `src/app/`, sibling verticals (`../<sibling>/*`) |
| **`src/modules/platform/`** | `src/core/`, `src/shared/` | `src/app/`, `src/modules/verticals/` |
| **`src/core/`** | `src/shared/` only | `src/app/`, `src/modules/` |
| **`src/shared/`** | External dependencies only (100% pure) | `src/app/`, `src/modules/`, `src/core/` |

---

### Detailed Folder Responsibilities

### 3.1 `src/app/` (Application Shell & Composition Root)
* **Purpose**: Mounts the app runtime, registers root providers, and boots navigation.
* **What Belongs**:
  * Root component (`App.tsx`).
  * Provider assembly (`QueryProvider`, `StoreProvider`, `ThemeProvider`).
  * Root navigation shell (`RootNavigator`, dynamic tab switcher, deep link configuration).
* **What Must NOT Belong**:
  * Feature-specific screens, business logic, or domain reducers.
  * API endpoints or domain types.
* **Interactions**: Imports manifests and registries from `src/modules/`, store and network singletons from `src/core/`, and top-level theme providers from `src/shared/`.

### 3.2 `src/modules/` (Business Domains & Platform Capabilities)
Divided into two sub-categories:
1. **`modules/verticals/`**: Self-contained business domains (e.g., `food`, `events`, `billing`).
   * Verticals **never** import sibling verticals directly.
   * Verticals expose only a `manifest.ts`.
2. **`modules/platform/`**: Cross-cutting domain capabilities (e.g., `auth`, `location`, `notifications`, `settings`).
   * Verticals consume platform features exclusively through the unified facade `@modules/platform`.
* **What Belongs**: Feature screens, private components, domain queries, localized state, validation schemas, manifests.
* **What Must NOT Belong**: Core infrastructure singletons, app-level bootstrap code, or domain-agnostic UI kit components.

### 3.3 `src/core/` (Headless Technical Infrastructure)
* **Purpose**: Provides UI-agnostic technical capabilities to the rest of the app.
* **What Belongs**:
  * `networking/`: Axios client, interceptors, `queryClient` singleton, network reconnect manager.
  * `storage/`: Fast MMKV key-value storage and encrypted secure storage wrappers.
  * `store/`: Base Redux store instance, static baseline slices (`session`, `flags`), and `injectReducer()` dynamic registry.
  * `navigation/`: Headless `navigationRef` and imperative `navigate()` service.
  * `i18n/`: Base i18next engine and `registerTranslationBundle()` helper.
* **What Must NOT Belong**:
  * JSX components, feature screens, domain-specific strings, or business reducers.
* **Interactions**: Pure foundation consumed by `modules` and `app`. Can only import domain-agnostic helpers from `shared`.

### 3.4 `src/shared/` (Design System & Pure Primitives)
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

## 4. Automated Architectural Guardrails (ESLint Configuration)

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

## 5. The Manifest Contract Pattern

A vertical communicates with the host application through a single typed interface.

```typescript
// src/modules/module.types.ts
import type { ComponentType } from 'react';

export type ModuleManifest = {
  /** Unique domain identifier (e.g. 'food', 'events') */
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

## 6. Adding a New Vertical Feature/Module (Step-by-Step)

Let's build a concrete **`food`** vertical module from scratch.

### Step 6.1: Scaffold the Module Directory
```bash
mkdir -p src/modules/verticals/food/{components,constants,hooks,i18n/locales,navigation,screens,services,store,types}
```

---

### Step 6.2: Define Domain Types and Route Enums

```typescript
// src/modules/verticals/food/constants/screens.constants.ts
export enum EFoodScreens {
  FOOD_LIST = 'FoodList',
  FOOD_DETAIL = 'FoodDetail',
}
```

```typescript
// src/modules/verticals/food/types/navigation.types.ts
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { EFoodScreens } from '../constants/screens.constants';

export type FoodStackParamsList = {
  [EFoodScreens.FOOD_LIST]: undefined;
  [EFoodScreens.FOOD_DETAIL]: { dishId: string };
};

export type FoodScreenProps<T extends keyof FoodStackParamsList> =
  NativeStackScreenProps<FoodStackParamsList, T>;

export type FoodNavigationProps = NativeStackNavigationProp<FoodStackParamsList>;
```

---

### Step 6.3: Implement Module-Owned Localization

Store translations directly within the feature module:

```json
// src/modules/verticals/food/i18n/locales/en.json
{
  "TITLE": "Food Menu",
  "EMPTY": "No dishes found.",
  "DISH_PRICE": "Price",
  "ADD_TO_CART": "Add to Basket"
}
```

```typescript
// src/modules/verticals/food/i18n/index.ts
import en from './locales/en.json';
import { registerTranslationBundle } from '@core/i18n';

export const registerFoodTranslations = (): void => {
  registerTranslationBundle('food', { en });
};
```

```typescript
// src/modules/verticals/food/hooks/use-food-translation.hook.ts
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { registerFoodTranslations } from '../i18n';

registerFoodTranslations();

export const useFoodTranslation = () => {
  const { t, i18n } = useTranslation('food');
  const food_t = useCallback(
    (key: string, options?: Record<string, unknown>): string => t(key, options) as string,
    [t]
  );
  return { food_t, i18n };
};
```

---

### Step 6.4: Implement Domain Reducer (Dynamic Injection)

```typescript
// src/modules/verticals/food/store/food.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FoodState = {
  selectedCategory: string | 'all';
};

const initialState: FoodState = {
  selectedCategory: 'all',
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string | 'all'>) {
      state.selectedCategory = action.payload;
    },
    clearFoodState() {
      return initialState;
    },
  },
});

export const { setCategory, clearFoodState } = foodSlice.actions;
export const foodReducer = foodSlice.reducer;
```

---

### Step 6.5: Implement Navigation Stack

```typescript
// src/modules/verticals/food/navigation/food.stack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EFoodScreens } from '../constants/screens.constants';
import type { FoodStackParamsList } from '../types/navigation.types';
import FoodListScreen from '../screens/food-list.screen';
import FoodDetailScreen from '../screens/food-detail.screen';

const Stack = createNativeStackNavigator<FoodStackParamsList>();

const FoodStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={EFoodScreens.FOOD_LIST} component={FoodListScreen} />
    <Stack.Screen name={EFoodScreens.FOOD_DETAIL} component={FoodDetailScreen} />
  </Stack.Navigator>
);

export default FoodStack;
```

---

### Step 6.6: Export the Module Manifest

The `manifest.ts` is the **only entry point** exposed to the outside application:

```typescript
// src/modules/verticals/food/manifest.ts
import type { ModuleManifest } from '@modules/module.types';
import store, { injectReducer } from '@core/store/redux.store';
import { foodReducer, clearFoodState } from './store/food.slice';
import { registerFoodTranslations } from './i18n';
import { EFoodScreens } from './constants/screens.constants';

const foodManifest: ModuleManifest = {
  id: 'food',
  title: 'Food',
  flag: 'feature_food_enabled', // Remote config flag key

  onRegister: () => {
    // 1. Register domain translations
    registerFoodTranslations();
    // 2. Dynamically attach domain reducer to global store
    injectReducer('food', foodReducer);
  },

  // Lazy evaluation: Navigators are required on-demand
  getNavigator: () => require('./navigation/food.stack').default,

  deepLinks: {
    screens: {
      [EFoodScreens.FOOD_LIST]: 'food/menu',
      [EFoodScreens.FOOD_DETAIL]: 'food/dish/:dishId',
    },
  },

  onLogout: () => {
    // Session teardown: Purge private food state on sign-out
    store.dispatch(clearFoodState());
  },
};

export default foodManifest;
```

---

### Step 6.7: Register in the Central Registry

Add the manifest to the central vertical registry:

```typescript
// src/modules/registry.ts
import type { ModuleManifest } from './module.types';
import foodManifest from './verticals/food/manifest';
import eventsManifest from './verticals/events/manifest';

export const verticals: ModuleManifest[] = [
  foodManifest,
  eventsManifest,
];
```

**Result**: That is all. The `food` feature is now:
- Lazily loaded when navigated to.
- Feature-flag gated by `state.flags.feature_food_enabled`.
- Injected with isolated Redux state and translations.
- Cleared automatically on user logout.
- Mountable in the host dynamic tab bar or deep link resolver without altering `RootNavigator.tsx`.

---

## 7. Removing an Existing Module (Zero-Residual Cleanup)

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

## 8. Navigation Architecture & Route Separation

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
                │       FoodStack        ││      EventsStack       │
                │ (Internal Native Stack)││ (Internal Native Stack)│
                └────────────────────────┘└────────────────────────┘
```

### 8.1 Separation of Navigation Concerns
1. **Root Stack (`RootNavigator.tsx`)**: Hosts app bootstrap (`Splash`), authentication screens, full-screen platform modals, and the authenticated `MainNavigator`.
2. **Shell Tab Navigator (`MainNavigator.tsx`)**: Consumes `getActiveVerticals(flags)` and maps over active manifests using `getComponent={vertical.getNavigator}` with `lazy: true`.
3. **Module Stacks (`<vertical>.stack.tsx`)**: Completely private to each vertical. Route names inside `FoodStack` are invisible to and independent of `EventsStack`.

### 8.2 Headless Cross-Module Navigation
When a module needs to trigger navigation to another domain (e.g., food navigating to an event ticket confirmation), modules must **not** import route enums across vertical boundaries. Use the headless navigation service or deep links:

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

navigate('EventBooking', { eventId: 'evt_123' });
```

---

## 9. Networking & Data Layer

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
│    modules/verticals/food   │   │   modules/verticals/events  │
│  - food.api.ts              │   │  - events.api.ts            │
│  - food.queries.ts          │   │  - events.queries.ts        │
│  - food.keys.ts             │   │  - events.keys.ts           │
└─────────────────────────────┘   └─────────────────────────────┘
```

### 9.1 Headless Core Networking Singleton
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

### 9.2 Domain Query Keys Factory Pattern
To prevent query cache collision across features, each module uses a localized Query Key Factory:

```typescript
// src/modules/verticals/food/services/food.keys.ts
export const foodKeys = {
  all: ['food'] as const,
  lists: () => [...foodKeys.all, 'list'] as const,
  detail: (id: string) => [...foodKeys.all, 'detail', id] as const,
};
```

```typescript
// src/modules/verticals/food/services/food.queries.ts
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@core/networking';
import { foodKeys } from './food.keys';

export type DishItem = { id: string; name: string; price: number };

export const useFoodListQuery = () => {
  return useQuery({
    queryKey: foodKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get<DishItem[]>('/food/menu');
      return response.data;
    },
  });
};
```

---

## 10. State Management: Dynamic Reducer Injection

To prevent an oversized static `rootReducer` that bundles all features upfront, the Redux store uses a **runtime injection pattern**:

```typescript
// src/core/store/redux.store.ts
import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';
import { sessionReducer, flagsReducer } from './static-slices';

const staticReducers = {
  session: sessionReducer,
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

## 11. Comprehensive Testing Strategy

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

### 11.1 Unit Testing Feature Slices in Absolute Isolation
Because feature reducers do not depend on the global state tree, they can be tested as pure functions:

```typescript
// __tests__/food.slice.test.ts
import { foodReducer, setCategory, clearFoodState } from '../src/modules/verticals/food/store/food.slice';

describe('Food Domain Reducer', () => {
  it('updates the category filter', () => {
    const initialState = { selectedCategory: 'all' as const };
    const nextState = foodReducer(initialState, setCategory('desserts'));
    expect(nextState.selectedCategory).toBe('desserts');
  });

  it('resets state on clear', () => {
    const activeState = { selectedCategory: 'beverages' as const };
    const cleared = foodReducer(activeState, clearFoodState());
    expect(cleared.selectedCategory).toBe('all');
  });
});
```

### 11.2 Architectural Contract & Lazy Loading Tests
Automate verification that importing manifests does not eagerly evaluate heavy screen components:

```typescript
// __tests__/module-registry.test.ts
const mockFoodNavigatorLoaded = jest.fn();
jest.mock('../src/modules/verticals/food/navigation/food.stack', () => {
  mockFoodNavigatorLoaded();
  return { __esModule: true, default: () => null };
});

import { verticals, getActiveVerticals } from '../src/modules/registry';

describe('Module Registry Integrity', () => {
  it('keeps vertical navigators lazily evaluated on boot', () => {
    // Asserting that importing manifests did NOT execute the stack navigator
    expect(mockFoodNavigatorLoaded).not.toHaveBeenCalled();
  });

  it('gates modules according to feature flags', () => {
    const active = getActiveVerticals({ feature_food_enabled: false });
    expect(active.some(m => m.id === 'food')).toBe(false);

    const enabled = getActiveVerticals({ feature_food_enabled: true });
    expect(enabled.some(m => m.id === 'food')).toBe(true);
  });
});
```

---

## 12. Complete Sample Project Folder Structure

```text
SuperApp/
├── .eslintrc.js                   # Automated boundary zones (import/no-restricted-paths)
├── package.json                   # Workspaces descriptor
├── tsconfig.json                  # Path aliases (@app, @modules, @core, @shared)
├── src/
│   ├── app/                       # Composition Root (Shell)
│   │   ├── App.tsx                # App entrypoint & root providers
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
│   │   ├── platform/              # Cross-Cutting Reusable Capabilities
│   │   │   ├── auth/              # Login, register, session management
│   │   │   ├── location/          # GPS permissions, address picker
│   │   │   ├── notifications/     # FCM listeners, inbox screens
│   │   │   ├── settings/          # Language picker, theme preferences
│   │   │   ├── routes.ts          # Platform route constants
│   │   │   └── index.ts           # Unified @modules/platform facade
│   │   └── verticals/             # Isolated Business Domains
│   │       ├── food/              # Feature 1 (Self-Contained Micro-App)
│   │       │   ├── components/    # Feature-specific private UI
│   │       │   ├── constants/     # Screen enums
│   │       │   ├── hooks/         # Custom domain hooks
│   │       │   ├── i18n/          # Feature translations (en.json, ar.json)
│   │       │   ├── navigation/    # food.stack.tsx
│   │       │   ├── screens/       # FoodListScreen, FoodDetailScreen
│   │       │   ├── services/      # API queries & endpoints
│   │       │   ├── store/         # food.slice.ts
│   │       │   ├── types/         # Domain & navigation types
│   │       │   └── manifest.ts    # Single public integration contract
│   │       └── events/            # Feature 2 (Identical anatomy)
│   │
│   ├── core/                      # Headless Technical Foundation
│   │   ├── networking/            # Axios instance, queryClient, token refresh mutex
│   │   ├── storage/               # MMKV Storage & SecureStorage
│   │   ├── store/                 # Base store, static slices, injectReducer
│   │   ├── navigation/            # navigationRef, headless navigate() helper
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

## 13. Best Practices & Common Pitfalls

| Category | Best Practice | Common Anti-Pattern / Pitfall |
| :--- | :--- | :--- |
| **Shared Folder** | Keep `src/shared` 100% domain-agnostic. Store only primitives, UI tokens, and generic helpers. | Treating `shared/` as a dumping ground for feature constants, app route enums, or business types. |
| **Cross-Module Comms** | Communicate across modules via headless events, `@modules/platform` facade, or deep links. | Directly importing files from `../verticals/other-feature` (breaks independent deployability). |
| **Startup Performance** | Always use `getNavigator: () => require(...).default` to defer bundle evaluation. | Eagerly importing vertical stack navigators in `registry.ts` or `MainNavigator.tsx`. |
| **State Management** | Dynamically inject feature reducers (`injectReducer`) on feature activation. | Hardcoding domain reducers (`foodReducer`, `eventsReducer`) in the static `core/store`. |
| **Localization** | Co-locate translation files in `modules/<feature>/i18n` and register dynamically. | Hardcoding all domain strings in a monolithic `core/locales/en.json`. |
| **Enforcement** | Run `npm run lint` with `import/no-restricted-paths` on git pre-commit hooks and CI. | Relying on verbal agreements or wiki guidelines without automated lint checks. |

---

## 14. Pros and Cons: Architectural Trade-Off Analysis

### The Pros
* **Zero Merge Conflicts**: Feature teams build, update, and delete verticals without touching shared root files.
* **Instant Feature Flagging**: Modules turn on and off based on remote feature flags without conditional JSX trees.
* **Optimized TTI**: Metro defers loading screens and heavy dependencies until the user actually opens the vertical.
* **Effortless Teardown**: Deleting a feature is as simple as removing its manifest from `registry.ts` and deleting its folder.
* **High Testability**: Slices, services, and components can be tested in pure isolation without bootstrapping the app.

### The Cons
* **Initial Setup Ceremony**: Requires setting up manifests, boundary rules, and path aliases upfront.
* **Overkill for Small Apps**: For a simple application with 5–10 screens and 1–2 developers, this structure introduces unnecessary abstraction.
* **Dynamic Typing Overhead**: Dynamically injected Redux slices require optional typing (`state.food?: FoodState`) in root state types.
* **Cross-Feature Friction**: Engineers cannot quickly "reach across" to import code from another feature; they must design a platform abstraction or deep link.

---

## 15. When to Use and When NOT to Use

### When to Use (The Architectural Sweet Spot)
Adopt a modular vertical-slice architecture when your project meets the following criteria:

* **Team Size (4+ Engineers across 2+ Squads)**:
  When multiple developers or separate squads (e.g., Squad Food, Squad Events, Squad Billing) build features concurrently. It eliminates merge bottlenecks on central files.
* **App Scope (15+ Screens across Distinct Domains)**:
  When the application spans multiple business verticals that have independent lifecycles (e.g., an app with food delivery, event ticketing, loyalty rewards, and customer service).
* **Product Model (SuperApps, Multi-Tenant, or Feature-Flagged Apps)**:
  When modules need to be toggled on or off per tenant, per region, or via remote config flags without changing screen JSX trees.
* **Frequent Feature Experimentation**:
  When product management frequently tests new business initiatives that may be discontinued. In a vertical architecture, retired experiments can be deleted in 2 minutes with zero residual dead code.

---

### When NOT to Use (Signs It Is Overkill)
Avoid this architecture under the following conditions:

* **Small Team or Early MVP (1–2 Developers)**:
  When a solo developer or pair is rapidly validating product-market fit. The ceremony of manifests, isolated stacks, and ESLint boundary configurations slows down rapid prototyping.
* **Small, Single-Purpose Apps (Under 10–15 Screens)**:
  Simple utilities (e.g., a weather application, a calculator, a basic habit tracker, a flashlight tool). Slicing an app with 5 screens into vertical micro-apps adds unnecessary friction.
* **Highly Coupled, Single-Canvas Products**:
  Applications where 80–90% of screens continuously mutate the same shared state tree in real time (e.g., a video editor, a photo retouching studio, or a real-time collaborative whiteboard). Here, vertical slicing creates artificial barriers that fight against the product's natural data flow.

---

### Clear Warning Signs the Structure is Overkill
If you observe these symptoms in your team, the modular structure is likely hindering rather than helping:
1. **Boilerplate Exceeds Business Logic**: Engineers spend more time creating folder skeletons, route enums, and manifest files than writing feature logic.
2. **Single Developer Maintaining All Verticals**: If one person owns the entire codebase, the isolation benefits disappear while the abstraction tax remains.
3. **The "Everything in Platform" Trap**: Developers find themselves unable to keep verticals isolated and end up moving 70% of code into `platform/` or `shared/` to bypass boundaries.
4. **Boundary Workarounds**: Engineers constantly bypass ESLint rules with `// eslint-disable` comments or use deep cross-imports because features are inherently inseparable.

---

### Summary Mental Model for New Feature Work

```
Is it a distinct business domain? (Food, Events, Billing)
  ├── YES ──► src/modules/verticals/<name>/
  └── NO
        ├── Is it a reusable domain capability used by multiple verticals? (Auth, Location, Notifications)
        │     └── YES ──► src/modules/platform/<name>/ (Exposed via @modules/platform facade)
        │
        ├── Is it a headless, UI-agnostic technical engine? (Axios, MMKV, Redux Store)
        │     └── YES ──► src/core/<name>/
        │
        ├── Is it a 100% pure, domain-agnostic UI primitive or token? (Button, Spacing, Typography)
        │     └── YES ──► src/shared/<name>/
        │
        └── Is it app bootstrap, root linking, or provider assembly?
              └── YES ──► src/app/
```
