import { COLORS } from "@shared/constants/colors.constants";
import { ITheme } from "@shared/types/theme.types";
import { StyleSheet } from "react-native";

export const styling = (theme: ITheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS[theme].background,
        alignItems: 'center',
        justifyContent: 'center',
    }
})