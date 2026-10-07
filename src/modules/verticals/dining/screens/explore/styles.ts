import { ITheme } from '@shared/types/theme.types';
import { StyleSheet } from 'react-native';
import { COLORS } from '@shared/constants/colors.constants';
import { EFonts, RADIUS, SPACING } from '@shared/constants/styles.constants';

export const styling = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    gap: SPACING.XS,
  },
  eyebrow: {
    color: COLORS[theme]['brand-primary'],
    fontFamily: EFonts.SEMI_BOLD,
  },
  title: {
    fontSize: 26,
  },
  subtitle: {
    color: COLORS[theme]['text-secondary'],
  },
  searchBox: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderRadius: RADIUS.SM,
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    backgroundColor: COLORS[theme].surface,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.SM,
    color: COLORS[theme]['text-primary'],
    fontFamily: EFonts.REGULAR,
    fontSize: 13,
  },
  categories: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    gap: SPACING.SM,
  },
  categoryChip: {
    overflow: 'hidden',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.FULL,
    color: COLORS[theme]['text-secondary'],
    borderWidth: 1,
    borderColor: COLORS[theme].border,
    backgroundColor: COLORS[theme].surface,
  },
  categoryChipSelected: {
    color: '#FFFFFF',
    backgroundColor: COLORS[theme]['brand-primary'],
    borderColor: COLORS[theme]['brand-primary'],
  },
  eventList: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING['3XL'],
    gap: SPACING.MD,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.XS,
  },
  resultCount: {
    color: COLORS[theme]['text-secondary'],
  },
  emptyState: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.XS,
  },
});