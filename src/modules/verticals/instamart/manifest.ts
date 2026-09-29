import type { ModuleManifest } from '@core/modules/types';
import { INSTAMART_VERTICAL_ID } from './types';

const instamartManifest: ModuleManifest = {
  id: INSTAMART_VERTICAL_ID,
  title: 'Instamart',
  getNavigator: () => require('./navigation/vertical.navigator').default,
};

export default instamartManifest;