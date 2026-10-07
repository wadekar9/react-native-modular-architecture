import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { EFonts, RADIUS, SPACING } from '@shared/constants/styles.constants';
import { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) => StyleSheet.create({
    screen: { flex: 1 },
    content: {
      padding: SPACING.MD,
      paddingTop: SPACING.LG,
      paddingBottom: SPACING['2XL'],
      gap: SPACING.LG,
    },
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    eyebrow: {
      color: COLORS[theme]['brand-primary'],
      fontFamily: EFonts.SEMI_BOLD,
    },
    title: { fontSize: 25, marginTop: SPACING.XS },
    countBadge: {
      minWidth: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.FULL,
      backgroundColor: COLORS[theme]['brand-primary-soft'],
    },
    countText: {
      color: COLORS[theme]['brand-primary'],
      fontFamily: EFonts.SEMI_BOLD,
    },
    emptyState: {
      minHeight: 360,
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.SM,
    },
    emptyIcon: {
      width: 62,
      height: 62,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.SM,
      borderRadius: RADIUS.FULL,
      backgroundColor: COLORS[theme]['brand-primary-soft'],
    },
    emptyCopy: {
      color: COLORS[theme]['text-secondary'],
      textAlign: 'center',
      maxWidth: 250,
    },
    browseButton: {
      minHeight: 44,
      justifyContent: 'center',
      marginTop: SPACING.SM,
      paddingHorizontal: SPACING.LG,
      borderRadius: RADIUS.SM,
      backgroundColor: COLORS[theme]['brand-primary'],
    },
    browseLabel: { color: '#FFFFFF' },
    orderList: { gap: SPACING.SM },
    orderCard: {
      gap: SPACING.SM,
      padding: SPACING.MD,
      borderWidth: 1,
      borderColor: COLORS[theme].border,
      borderRadius: RADIUS.MD,
      backgroundColor: COLORS[theme].surface,
    },
    pressed: { opacity: 0.86 },
    cardTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.SM },
    receiptIcon: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.SM,
      backgroundColor: COLORS[theme]['brand-primary-soft'],
    },
    orderHeading: { flex: 1, gap: 2 },
    secondary: { flex: 1, color: COLORS[theme]['text-secondary'] },
    cardDivider: { height: 1, backgroundColor: COLORS[theme].border },
    cardBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.XS },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: RADIUS.FULL,
      backgroundColor: COLORS[theme]['state-success'],
    },
    statusText: { color: COLORS[theme]['text-secondary'] },
    addressRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.XS },
  });
