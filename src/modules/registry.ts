import type { ModuleManifest } from './module.types';
import diningManifest from './verticals/dining/manifest';
import foodManifest from './verticals/food/manifest';

export const verticals: ModuleManifest[] = [
  foodManifest,
  diningManifest
];

export const getActiveVerticals = (flags: Record<string, boolean | undefined>) =>
  verticals.filter(vertical => vertical.flag === undefined || flags[vertical.flag] === true);

export const runLogoutHooks = (): void => {
  verticals.forEach(vertical => vertical.onLogout?.());
};