import { moderateScale } from "@shared/constants";
import { StyleSheet } from "react-native";

export const styling = () => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(50),
        padding: moderateScale(20),
    }
});
