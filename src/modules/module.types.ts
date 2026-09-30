import type { ComponentType } from 'react';

export type ModuleManifest = {
  id: string;
  flag?: string;
  title: string;
  icon?: string;
  getNavigator: () => ComponentType;
  onLogout?: () => void;
};