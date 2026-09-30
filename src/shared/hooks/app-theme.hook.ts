import { COLORS } from '@shared/constants/colors.constants';
import { AppThemeContext } from '@shared/theme';
import { useContext, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useAppTheme = () => {
    const context = useContext(AppThemeContext);
    const insets = useSafeAreaInsets();

    if (!context) {
        throw new Error('useAppTheme must be used within an AppThemeProvider');
    }

    const { changeTheme, theme, selectedTheme } = context;

    return useMemo(() => ({
        changeTheme,
        theme,
        selectedTheme,
        colors: COLORS[theme],
        insets,
    }), [changeTheme, theme, selectedTheme, insets]);
};
