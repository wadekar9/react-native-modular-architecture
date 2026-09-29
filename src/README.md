# Source Layers

```text
app/       composition, root navigation, providers
  -> core/, shared/, modules/
core/      non-UI infrastructure and app-level state
  -> shared/
modules/   platform capabilities and removable verticals
  -> core/, shared/
shared/    generic UI and pure helpers
  -> shared/ and third-party packages only
```

## Dependency Rules

- `shared` imports nothing from `core`, `modules`, or `app`.
- `core` may import `shared`; it never imports `modules` or `app`.
- `modules/platform` may import `core` and `shared`.
- A vertical may import `core`, `shared`, and `modules/platform` through the platform entry point only. It never imports `app` or another vertical.
- Only `app` imports `modules/registry.ts`.
- `import/no-cycle` is enabled to prevent dependency cycles.

## Vertical Registration

Each vertical exports a `ModuleManifest` from `manifest.ts`. Its navigator is required inside `getNavigator`, so the registry can enumerate modules without loading their navigators. Add or remove a vertical by updating `modules/registry.ts` and its folder.