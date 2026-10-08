import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { RADIUS, SPACING } from '@shared/constants/styles.constants';
import type { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) => StyleSheet.create({
  options: { flexDirection: 'row', gap: SPACING.XS },
  option: {
    minHeight: 30,
    justifyContent: 'center',
    paddingHorizontal: SPACING.SM,
    borderRadius: RADIUS.XS,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
  },
  selectedOption: { borderColor: COLORS[theme]['brand-primary'], backgroundColor: COLORS[theme]['brand-primary-soft'] },
  label: { color: COLORS[theme]['text-secondary'], fontSize: 10 },
  selectedLabel: { color: COLORS[theme]['brand-primary'] },
});