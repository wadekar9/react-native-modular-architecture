import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { RADIUS, SPACING } from '@shared/constants/styles.constants';
import type { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) => StyleSheet.create({
  searchField: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS[theme].surface,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: SPACING.SM,
    color: COLORS[theme]['text-primary'],
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  clearButton: { width: 30, height: 36, alignItems: 'center', justifyContent: 'center' },
});