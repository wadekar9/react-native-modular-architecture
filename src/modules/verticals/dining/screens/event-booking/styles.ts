import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { moderateScale, RADIUS, SPACING } from '@shared/constants/styles.constants';
import type { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) => StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    minHeight: moderateScale(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS[theme].border,
  },
  backButton: {
    width: moderateScale(38),
    height: moderateScale(38),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    minWidth: moderateScale(48),
    alignItems: 'center',
  },
  stepText: {
    color: COLORS[theme]['text-secondary'],
  },
  content: {
    padding: SPACING.MD,
    paddingBottom: moderateScale(116),
    gap: SPACING.LG,
  },
  eventSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
    padding: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    borderRadius: RADIUS.MD,
    backgroundColor: COLORS[theme].surface,
  },
  summaryIcon: {
    width: moderateScale(42),
    height: moderateScale(42),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS[theme]['brand-primary-soft'],
  },
  summaryCopy: {
    flex: 1,
    gap: SPACING.XS,
  },
  section: {
    gap: SPACING.MD,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.SM,
  },
  secondary: {
    color: COLORS[theme]['text-secondary'],
  },
  sessionList: {
    gap: SPACING.SM,
  },
  sessionOption: {
    minHeight: moderateScale(50),
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS[theme].surface,
  },
  sessionSelected: {
    borderColor: COLORS[theme]['brand-primary'],
    backgroundColor: COLORS[theme]['brand-primary-soft'],
  },
  radio: {
    width: moderateScale(18),
    height: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS[theme]['text-muted'],
    borderRadius: RADIUS.FULL,
  },
  radioSelected: {
    borderColor: COLORS[theme]['brand-primary'],
  },
  radioDot: {
    width: moderateScale(9),
    height: moderateScale(9),
    borderRadius: RADIUS.FULL,
    backgroundColor: COLORS[theme]['brand-primary'],
  },
  selectedText: {
    flex: 1,
    color: COLORS[theme]['brand-primary'],
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  quantityButton: {
    width: moderateScale(38),
    height: moderateScale(38),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS[theme].surface,
  },
  quantityDisabled: {
    opacity: 0.5,
  },
  quantity: {
    minWidth: moderateScale(20),
    textAlign: 'center',
  },
  capacityNote: {
    marginTop: -SPACING.SM,
    color: COLORS[theme]['text-secondary'],
  },
  error: {
    color: COLORS[theme]['state-danger'],
  },
  priceSummary: {
    padding: SPACING.MD,
    gap: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS[theme].border,
  },
  priceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  demoNote: {
    alignSelf: 'flex-start',
    color: COLORS[theme]['text-secondary'],
    backgroundColor: COLORS[theme]['surface-alt'],
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.XS,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: moderateScale(76),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS[theme].border,
    backgroundColor: COLORS[theme].surface,
  },
  confirmButton: {
    minHeight: moderateScale(48),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.LG,
    borderRadius: RADIUS.SM,
    backgroundColor: COLORS[theme]['brand-primary'],
  },
  confirmText: {
    color: '#FFFFFF',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.LG,
    gap: SPACING.MD,
  },
  backLink: {
    padding: SPACING.SM,
  },
  linkText: {
    color: COLORS[theme]['brand-primary'],
  },
});