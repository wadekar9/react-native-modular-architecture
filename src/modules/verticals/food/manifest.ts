import type { ModuleManifest } from '@modules/module.types';

const foodManifest: ModuleManifest = {
  id: 'food',
  title: 'Food',
  getNavigator: () => require('./navigation/food.stack').default,
};

export default foodManifest;