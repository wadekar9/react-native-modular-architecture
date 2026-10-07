import { COLORS } from "@shared/constants";
import { ITheme } from "@shared/types";
import { StyleSheet } from "react-native";

export const styling = (theme: ITheme) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS[theme].background,
    }
})