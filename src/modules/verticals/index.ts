/**
 * ============================================================================
 * VERTICALS LAYER ARCHITECTURAL OVERVIEW
 * ============================================================================
 *
 * This directory (`src/modules/verticals/`) houses all domain-specific business
 * verticals of the SuperApp (e.g., Food, Dining, Grocery, Rides, etc.).
 *
 * ----------------------------------------------------------------------------
 * 1. STANDARD FOLDER STRUCTURE FOR EVERY VERTICAL
 * ----------------------------------------------------------------------------
 * Every vertical should adhere to this standardized internal folder blueprint:
 *
 *   src/modules/verticals/<vertical_name>/
 *   ├── api/            -> API calls, data repositories, TanStack Query hooks
 *   ├── components/     -> UI components private to this vertical
 *   ├── constants/      -> Internal constants and screen enum names
 *   ├── hooks/          -> Custom React hooks private to this vertical
 *   ├── navigation/     -> Vertical root stack & tab navigators
 *   ├── screens/        -> Screen components for this vertical
 *   ├── store/          -> Optional Redux slice (e.g. cart.slice.ts)
 *   ├── types/          -> TypeScript domain types and navigation param lists
 *   └── manifest.ts     -> MANDATORY: The single public ModuleManifest contract
 *
 * ----------------------------------------------------------------------------
 * 2. ARCHITECTURAL BOUNDARY RULES
 * ----------------------------------------------------------------------------
 * Rule 1: NO HORIZONTAL DEPENDENCIES (Vertical-to-Vertical Isolation)
 *   - `food` MUST NEVER import code from `dining`.
 *   - `dining` MUST NEVER import code from `food`.
 *   - If both verticals need common UI, place it in `@shared/components`.
 *   - If both verticals need cross-cutting features (e.g. chat, location, auth),
 *     consume them through `@modules/platform/`.
 *
 * Rule 2: STRICT DOWNWARD DEPENDENCY FLOW
 *   - Verticals CAN import from:
 *       * `@core/*`              (networking, storage, base store, permissions)
 *       * `@shared/*`            (design system, UI kit, theme, utils)
 *       * `@modules/platform/*`  (cross-cutting domain features: auth, chat, location)
 *   - Core and Shared CAN NEVER import from any Vertical.
 *
 * Rule 3: MANIFEST-ONLY EXPOSURE
 *   - The host application only accesses a vertical through its `manifest.ts`.
 *   - Navigators are loaded lazily via `manifest.getNavigator()`.
 *   - Reducers are injected dynamically via `manifest.onRegister()`.
 *
 * ----------------------------------------------------------------------------
 * 3. HOW TO ADD A NEW VERTICAL IN 3 STEPS
 * ----------------------------------------------------------------------------
 * 1. Create a new folder: `src/modules/verticals/<new_vertical>/`.
 * 2. Implement its screens, navigators, and a `manifest.ts` adhering to `ModuleManifest`.
 * 3. Register its manifest in `src/modules/registry.ts` inside the `verticals` array.
 * That's it! The vertical will automatically appear in `MainNavigator` and top tabs.
 *
 * ----------------------------------------------------------------------------
 * 4. HOW TO REMOVE A VERTICAL SAFELY
 * ----------------------------------------------------------------------------
 * Remove its manifest entry from `src/modules/registry.ts`.
 * Because no core file, root navigator, or root reducer directly imports the vertical,
 * removing it leaves zero dangling references or broken builds.
 */

export { default as foodManifest } from './food/manifest';
export { default as diningManifest } from './dining/manifest';

