import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { EFonts, EFontSize, moderateScale } from '@shared/constants/styles.constants';
import { ITheme } from '@shared/types/theme.types';

export const styling = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS[theme].background,
    },
    headerRightActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(8),
    },
    headerActionBtn: {
      padding: moderateScale(6),
    },
    filterBarContainer: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(16),
      borderBottomWidth: 1,
      borderBottomColor: COLORS[theme].border,
      backgroundColor: COLORS[theme].surface,
    },
    filterScrollContent: {
      flexDirection: 'row',
      gap: moderateScale(8),
    },
    filterChip: {
      paddingHorizontal: moderateScale(14),
      paddingVertical: moderateScale(6),
      borderRadius: moderateScale(16),
      borderWidth: 1,
      borderColor: COLORS[theme].border,
      backgroundColor: COLORS[theme].surface,
    },
    filterChipActive: {
      backgroundColor: COLORS[theme]['brand-primary'],
      borderColor: COLORS[theme]['brand-primary'],
    },
    filterChipText: {
      fontFamily: EFonts.MEDIUM,
      fontSize: EFontSize.XS,
      color: COLORS[theme]['text-secondary'],
    },
    filterChipTextActive: {
      color: '#FFFFFF',
      fontFamily: EFonts.SEMI_BOLD,
    },
    listContent: {
      flexGrow: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(32),
      marginTop: moderateScale(40),
    },
    emptyTitle: {
      fontFamily: EFonts.SEMI_BOLD,
      fontSize: EFontSize.XL,
      color: COLORS[theme]['text-primary'],
      marginTop: moderateScale(16),
      marginBottom: moderateScale(8),
      textAlign: 'center',
    },
    emptyDescription: {
      fontFamily: EFonts.REGULAR,
      fontSize: EFontSize.BASE,
      color: COLORS[theme]['text-secondary'],
      textAlign: 'center',
      lineHeight: moderateScale(22),
    },
  });

