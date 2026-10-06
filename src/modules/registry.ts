import type { ModuleManifest } from './module.types';
import diningManifest from './verticals/dining/manifest';
import foodManifest from './verticals/food/manifest';

export const verticals: ModuleManifest[] = [
  foodManifest,
  diningManifest
];

export const getActiveVerticals = (flags: Record<string, boolean | undefined>) => {
  const active = verticals.filter(vertical => vertical.flag === undefined || flags[vertical.flag] === true);
  active.forEach(vertical => vertical.onRegister?.());
  return active;
};

export const runLogoutHooks = (): void => {
  verticals.forEach(vertical => vertical.onLogout?.());
};

export const getVerticalDeepLinks = (): Record<string, any> => {
  const screens: Record<string, any> = {};
  verticals.forEach(vertical => {
    if (vertical.deepLinks) {
      screens[vertical.id] = vertical.deepLinks;
    }
  });
  return screens;
};