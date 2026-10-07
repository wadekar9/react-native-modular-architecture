import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { moderateScale, RADIUS, SPACING } from '@shared/constants/styles.constants';
import type { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) => StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: RADIUS.MD,
    backgroundColor: COLORS[theme].surface,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
  },
  featuredCard: {
    marginBottom: SPACING.SM,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  image: {
    height: moderateScale(176),
    justifyContent: 'space-between',
    padding: SPACING.MD,
  },
  featuredImage: {
    height: moderateScale(214),
  },
  imageRadius: {
    borderTopLeftRadius: RADIUS.MD,
    borderTopRightRadius: RADIUS.MD,
  },
  imageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 18, 17, 0.34)',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F6F1E8',
    borderRadius: RADIUS.XS,
    paddingHorizontal: SPACING.SM,
    paddingVertical: moderateScale(5),
  },
  categoryText: {
    color: '#33443B',
    fontFamily: 'Poppins-SemiBold',
  },
  imageCaption: {
    gap: moderateScale(2),
  },
  imageTitle: {
    color: '#FFFFFF',
    maxWidth: '88%',
  },
  imageHost: {
    color: 'rgba(255,255,255,0.86)',
  },
  details: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    gap: moderateScale(9),
  },
  detailLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  detailText: {
    color: COLORS[theme]['text-primary'],
  },
  mutedDetail: {
    flexShrink: 1,
    color: COLORS[theme]['text-secondary'],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS[theme].border,
    paddingTop: SPACING.SM,
    marginTop: moderateScale(2),
  },
  perTicket: {
    color: COLORS[theme]['text-secondary'],
  },
  availability: {
    color: COLORS[theme]['text-secondary'],
  },
});