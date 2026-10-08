import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { RADIUS, SPACING } from '@shared/constants/styles.constants';
import type { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) => StyleSheet.create({
  container: { gap: SPACING.XS },
  filterHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.SM,
  },
  headingLabel: { paddingHorizontal: SPACING.MD, color: COLORS[theme]['text-secondary'], fontFamily: 'Poppins-SemiBold', fontSize: 10 },
  clearLabel: { color: COLORS[theme]['brand-primary'] },
  choices: { paddingHorizontal: SPACING.MD, paddingVertical: SPACING.SM, gap: SPACING.XS },
  choice: {
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: SPACING.MD,
    borderRadius: RADIUS.FULL,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    backgroundColor: COLORS[theme].surface,
  },
  choiceSelected: { borderColor: COLORS[theme]['brand-primary'], backgroundColor: COLORS[theme]['brand-primary'] },
  choiceLabel: { color: COLORS[theme]['text-secondary'] },
  choiceLabelSelected: { color: '#FFFFFF' },
  sortRow: { gap: SPACING.XS, paddingTop: SPACING.XS, paddingHorizontal: SPACING.MD },
});