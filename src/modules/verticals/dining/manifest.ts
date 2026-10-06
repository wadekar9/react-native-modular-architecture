import type { ModuleManifest } from '@modules/module.types';
import { EDiningStackScreens } from './constants/screens.constants';

const diningManifest: ModuleManifest = {
  id: 'dining',
  title: 'Dining',
  getNavigator: () => require('./navigation/dining.stack').default,
  deepLinks: {
    screens: {
      [EDiningStackScreens.EVENT_DETAILS]: 'dining/event/:id',
    },
  },
};

export default diningManifest;