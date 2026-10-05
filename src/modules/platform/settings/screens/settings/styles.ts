import { COLORS } from "@shared/constants/colors.constants";
import { ITheme } from "@shared/types/theme.types";
import { StyleSheet } from "react-native";

export const styling = (theme: ITheme) => StyleSheet.create({
    screen: { flex: 1 },
    content: { padding: 20, gap: 22 },
    backButton: { paddingBottom: 6 },
    section: { gap: 14, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth, borderColor: COLORS[theme].border },
    themeOptions: { flexDirection: 'row', gap: 10 },
    themeOption: { flex: 1, minHeight: 42, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    testAlertBox: { paddingTop: 8 },
    testAlertButton: {
      minHeight: 44,
      borderWidth: 1,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
  });