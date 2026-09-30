import type { ModuleManifest } from '@modules/module.types';
import { EVENTS_VERTICAL_ID } from './types';

const eventsManifest: ModuleManifest = {
  id: EVENTS_VERTICAL_ID,
  title: 'Events',
  getNavigator: () => require('./navigation/vertical.navigator').default,
};

export default eventsManifest;