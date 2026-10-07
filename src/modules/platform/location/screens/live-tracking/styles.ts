import { COLORS, EFonts, EFontSize, moderateScale } from "@shared/constants";
import { ITheme } from "@shared/types";
import { StyleSheet } from "react-native";

export const styling = (theme: ITheme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS[theme].background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS[theme].background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS[theme].background,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
  },
  headerIconBtn: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: COLORS[theme].surface,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    gap: moderateScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: COLORS[theme].surface,
  },
  livePulseDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#22C55E',
  },
  titleText: {
    fontFamily: EFonts.SEMI_BOLD,
    fontSize: EFontSize.SM,
  },
  bottomCardWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
