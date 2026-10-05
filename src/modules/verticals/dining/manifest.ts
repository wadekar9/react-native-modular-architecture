import type { ModuleManifest } from '@modules/module.types';

const diningManifest: ModuleManifest = {
  id: 'dining',
  title: 'Dining',
  getNavigator: () => require('./navigation/dining.stack').default,
};

export default diningManifest;