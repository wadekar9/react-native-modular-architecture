import { COLORS } from '@shared/constants/colors.constants';
import { EFonts, moderateScale } from '@shared/constants/styles.constants';
import { ITheme } from '@shared/types/theme.types';
import { StyleSheet } from 'react-native';

export const styling = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS[theme].background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(32),
  },
  card: {
    marginTop: moderateScale(20),
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    backgroundColor: COLORS[theme].surface,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    marginBottom: moderateScale(8),
  },
  subtitle: {
    marginBottom: moderateScale(20),
    lineHeight: moderateScale(20),
  },
  form: {
    gap: moderateScale(16),
  },
  submitButton: {
    marginTop: moderateScale(8),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(20),
    gap: moderateScale(6),
  },
  footerText: {
    fontFamily: EFonts.REGULAR,
    fontSize: moderateScale(14),
  },
  footerLink: {
    fontFamily: EFonts.SEMI_BOLD,
    fontSize: moderateScale(14),
    color: COLORS[theme]['brand-primary'],
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(10),
  },
  errorText: {
    color: COLORS[theme]['state-danger'],
    fontSize: moderateScale(13),
    fontFamily: EFonts.REGULAR,
    textAlign: 'center',
  },
});
