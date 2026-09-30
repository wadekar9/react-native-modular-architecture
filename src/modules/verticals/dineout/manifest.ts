import type { ModuleManifest } from '@modules/module.types';
import { DINEOUT_VERTICAL_ID } from './types';

const dineoutManifest: ModuleManifest = {
  id: DINEOUT_VERTICAL_ID,
  title: 'Dineout',
  getNavigator: () => require('./navigation/vertical.navigator').default,
};

export default dineoutManifest;