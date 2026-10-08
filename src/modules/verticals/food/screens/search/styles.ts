import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import {
  moderateScale,
  RADIUS,
  SPACING,
} from '@shared/constants/styles.constants';
import type { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) => StyleSheet.create({
    screen: { flex: 1 },
    header: {
      minHeight: moderateScale(62),
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SM,
      paddingHorizontal: SPACING.MD,
    },
    backButton: {
      width: 38,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: { flex: 1, fontSize: 17 },
    cartButton: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: COLORS[theme].border,
      borderRadius: RADIUS.SM,
      backgroundColor: COLORS[theme].surface,
    },
    cartBadge: {
      position: 'absolute',
      right: -4,
      top: -4,
      minWidth: 18,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.FULL,
      backgroundColor: COLORS[theme]['brand-primary'],
    },
    badgeText: { color: '#FFFFFF', fontSize: 10 },
    results: {
      paddingHorizontal: SPACING.MD,
      paddingBottom: SPACING['2XL'],
      gap: SPACING.SM,
    },
    resultsHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.XS,
    },
    resultCount: {
      marginTop: SPACING.XS,
      color: COLORS[theme]['text-secondary'],
    },
    emptyState: {
      minHeight: 260,
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.SM,
    },
    emptyIcon: {
      width: 54,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.XS,
      borderRadius: RADIUS.FULL,
      backgroundColor: COLORS[theme]['surface-alt'],
    },
    emptyCopy: { color: COLORS[theme]['text-secondary'], textAlign: 'center' },
    resetButton: { padding: SPACING.SM, marginTop: SPACING.XS },
    resetLabel: { color: COLORS[theme]['brand-primary'] },
  });
