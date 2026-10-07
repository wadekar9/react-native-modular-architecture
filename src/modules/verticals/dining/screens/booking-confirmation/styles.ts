import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { EFonts, moderateScale, RADIUS, SPACING } from '@shared/constants/styles.constants';
import type { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.MD,
    paddingBottom: SPACING.LG,
  },
  content: {
    alignItems: 'center',
    paddingTop: SPACING['2XL'],
    gap: SPACING.SM,
  },
  successMark: {
    width: moderateScale(68),
    height: moderateScale(68),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.FULL,
    backgroundColor: COLORS[theme]['brand-primary-soft'],
    marginBottom: SPACING.SM,
  },
  eyebrow: {
    color: COLORS[theme]['brand-primary'],
    fontFamily: EFonts.SEMI_BOLD,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
  },
  subtitle: {
    maxWidth: 320,
    textAlign: 'center',
    color: COLORS[theme]['text-secondary'],
    lineHeight: 21,
  },
  bookingDetails: {
    width: '100%',
    gap: SPACING.MD,
    marginTop: SPACING.LG,
    padding: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    borderRadius: RADIUS.MD,
    backgroundColor: COLORS[theme].surface,
  },
  eventHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  ticketIcon: {
    width: moderateScale(42),
    height: moderateScale(42),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS[theme]['brand-primary-soft'],
  },
  eventCopy: {
    flex: 1,
    gap: SPACING.XS,
  },
  secondary: {
    color: COLORS[theme]['text-secondary'],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS[theme].border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  detailText: {
    flex: 1,
    color: COLORS[theme]['text-secondary'],
  },
  referenceBox: {
    alignItems: 'center',
    gap: SPACING.XS,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS[theme]['surface-alt'],
  },
  referenceLabel: {
    color: COLORS[theme]['text-secondary'],
    fontFamily: EFonts.SEMI_BOLD,
  },
  reference: {
    color: COLORS[theme]['text-primary'],
  },
  doneButton: {
    minHeight: moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS[theme]['brand-primary'],
  },
  doneText: {
    color: '#FFFFFF',
  },
});