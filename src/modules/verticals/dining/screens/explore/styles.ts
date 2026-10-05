import { ITheme } from '@shared/types/theme.types';
import { StyleSheet } from 'react-native';

export const styling = (_theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    gap: 16,
  },
});