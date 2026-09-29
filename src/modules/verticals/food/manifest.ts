import type { ModuleManifest } from '@core/modules/types';
import { FOOD_VERTICAL_ID } from './types';

const foodManifest: ModuleManifest = {
  id: FOOD_VERTICAL_ID,
  title: 'Food',
  getNavigator: () => require('./navigation/vertical.navigator').default,
};

export default foodManifest;