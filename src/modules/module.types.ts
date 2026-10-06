import type { ComponentType } from 'react';

export type ModuleManifest = {
  id: string;
  flag?: string;
  title: string;
  icon?: string;
  getNavigator: () => ComponentType;
  deepLinks?: Record<string, any>;
  onLogout?: () => void;
};