import { StyleSheet } from 'react-native';
import { ITheme } from '@shared/types/common.types';
import { COLORS } from '@shared/constants/colors.constants';

export const styling = (theme: ITheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS[theme].background,
    },
});
