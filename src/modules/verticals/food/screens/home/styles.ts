import { COLORS } from "@shared/constants/colors.constants";
import { moderateScale } from "@shared/constants/styles.constants";
import { ITheme } from "@shared/types/theme.types";
import { StyleSheet } from "react-native";

export const styling = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(18),
    gap: moderateScale(16),
    backgroundColor: COLORS[theme].surface,
  }
});