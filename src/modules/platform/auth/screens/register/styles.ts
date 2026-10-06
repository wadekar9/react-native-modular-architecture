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
    marginTop: moderateScale(12),
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
    marginBottom: moderateScale(6),
  },
  subtitle: {
    marginBottom: moderateScale(18),
  },
  form: {
    gap: moderateScale(14),
  },
  row: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  halfInput: {
    flex: 1,
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
    marginBottom: moderateScale(10),
  },
  errorText: {
    color: COLORS[theme]['state-danger'],
    fontSize: moderateScale(13),
    fontFamily: EFonts.REGULAR,
    textAlign: 'center',
  },
  successBanner: {
    backgroundColor: '#E8F5E9',
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(10),
  },
  successText: {
    color: '#2E7D32',
    fontSize: moderateScale(13),
    fontFamily: EFonts.MEDIUM,
    textAlign: 'center',
  },
});
