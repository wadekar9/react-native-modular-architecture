import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { moderateScale, RADIUS, SPACING } from '@shared/constants/styles.constants';
import type { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    padding: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    borderRadius: RADIUS.MD,
    backgroundColor: COLORS[theme].surface,
  },
  recipeButton: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: SPACING.SM },
  image: { width: moderateScale(88), height: moderateScale(100), borderRadius: RADIUS.SM, backgroundColor: COLORS[theme]['surface-alt'] },
  content: { flex: 1, minWidth: 0, gap: SPACING.XS },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: SPACING.XS },
  name: { flex: 1 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metadata: { color: COLORS[theme]['text-secondary'] },
  tagRow: { flexDirection: 'row', gap: SPACING.XS },
  tag: {
    maxWidth: moderateScale(98),
    overflow: 'hidden',
    paddingHorizontal: SPACING.XS,
    paddingVertical: 2,
    borderRadius: RADIUS.XS,
    color: COLORS[theme]['text-secondary'],
    backgroundColor: COLORS[theme]['surface-alt'],
  },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.XS },
  time: { flexDirection: 'row', alignItems: 'center', gap: SPACING.XS },
  priceBlock: { alignItems: 'flex-end' },
  demoLabel: { color: COLORS[theme]['text-muted'], fontSize: 9 },
  addButton: {
    width: moderateScale(58),
    minHeight: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    borderRadius: RADIUS.SM,
    borderWidth: 1,
    borderColor: COLORS[theme]['brand-primary'],
  },
  addLabel: { color: COLORS[theme]['brand-primary'], fontSize: 10 },
});