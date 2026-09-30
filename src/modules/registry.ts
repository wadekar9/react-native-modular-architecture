import type { ModuleManifest } from './module.types';
import dineoutManifest from './verticals/dineout/manifest';
import eventsManifest from './verticals/events/manifest';
import foodManifest from './verticals/food/manifest';
import instamartManifest from './verticals/instamart/manifest';

export const verticals: ModuleManifest[] = [
  foodManifest,
  instamartManifest,
  dineoutManifest,
  eventsManifest,
];

export const getActiveVerticals = (flags: Record<string, boolean | undefined>) =>
  verticals.filter(vertical => vertical.flag === undefined || flags[vertical.flag] === true);

export const runLogoutHooks = (): void => {
  verticals.forEach(vertical => vertical.onLogout?.());
};