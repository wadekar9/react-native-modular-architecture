
import { ITheme } from '@shared/types/theme.types';
import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { RADIUS, SPACING } from '@shared/constants/styles.constants';

export const styling = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING['3XL'],
    gap: SPACING.MD,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
  },
  eyebrowText: {
    color: COLORS[theme]['brand-primary'],
    fontFamily: EFonts.SEMI_BOLD,
    letterSpacing: 0,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  headingCopy: {
    flex: 1,
    gap: SPACING.XS,
  },
  title: {
    fontSize: 26,
  },
  subtitle: {
    color: COLORS[theme]['text-secondary'],
  },
  eventCount: {
    minWidth: 74,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.SM,
    alignItems: 'center',
    backgroundColor: COLORS[theme]['brand-primary-soft'],
    borderRadius: RADIUS.SM,
  },
  countText: {
    color: COLORS[theme]['brand-primary'],
  },
  countLabel: {
    color: COLORS[theme]['text-secondary'],
    fontSize: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.SM,
  },
  muted: {
    color: COLORS[theme]['text-secondary'],
  },
  eventList: {
    gap: SPACING.MD,
  },
});