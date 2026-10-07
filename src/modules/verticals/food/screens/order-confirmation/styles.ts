import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import {
  EFonts,
  moderateScale,
  RADIUS,
  SPACING,
} from '@shared/constants/styles.constants';
import type { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) =>
  StyleSheet.create({
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
      width: 66,
      height: 66,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.SM,
      borderRadius: RADIUS.FULL,
      backgroundColor: COLORS[theme]['brand-primary-soft'],
    },
    eyebrow: {
      color: COLORS[theme]['brand-primary'],
      fontFamily: EFonts.SEMI_BOLD,
    },
    title: { textAlign: 'center', fontSize: 25 },
    subtitle: {
      maxWidth: 310,
      textAlign: 'center',
      color: COLORS[theme]['text-secondary'],
      lineHeight: 20,
    },
    orderCard: {
      width: '100%',
      gap: SPACING.MD,
      marginTop: SPACING.LG,
      padding: SPACING.MD,
      borderWidth: 1,
      borderColor: COLORS[theme].border,
      borderRadius: RADIUS.MD,
      backgroundColor: COLORS[theme].surface,
    },
    referenceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SM,
    },
    receiptIcon: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.SM,
      backgroundColor: COLORS[theme]['brand-primary-soft'],
    },
    referenceCopy: { flex: 1, gap: 2 },
    muted: { color: COLORS[theme]['text-secondary'] },
    divider: { height: 1, backgroundColor: COLORS[theme].border },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.SM },
    infoText: { flex: 1, color: COLORS[theme]['text-secondary'] },
    totalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    detailsButton: {
      minHeight: 46,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.SM,
      borderRadius: RADIUS.SM,
      borderWidth: 1,
      borderColor: COLORS[theme]['brand-primary'],
    },
    detailsLabel: { color: COLORS[theme]['brand-primary'] },
    primaryButton: {
      minHeight: moderateScale(50),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.SM,
      backgroundColor: COLORS[theme]['brand-primary'],
    },
    primaryLabel: { color: '#FFFFFF' },
  });
