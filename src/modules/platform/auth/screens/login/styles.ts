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
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(24),
  },
  card: {
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
  logo: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(16),
    alignSelf: 'center',
    marginBottom: moderateScale(12),
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(6),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: moderateScale(20),
  },
  form: {
    gap: moderateScale(14),
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: moderateScale(-4),
    marginBottom: moderateScale(4),
  },
  forgotPasswordText: {
    fontFamily: EFonts.MEDIUM,
    fontSize: moderateScale(13),
    color: COLORS[theme]['brand-primary'],
  },
  submitButton: {
    marginTop: moderateScale(8),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(18),
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
    marginBottom: moderateScale(6),
  },
  errorText: {
    color: COLORS[theme]['state-danger'],
    fontSize: moderateScale(13),
    fontFamily: EFonts.REGULAR,
    textAlign: 'center',
  },
});
