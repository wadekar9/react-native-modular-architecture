import { COLORS } from '@shared/constants/colors.constants';
import { useAppTheme } from '@shared/hooks';
import { ITheme } from '@shared/types/theme.types';
import React from 'react';
import { StatusBar, StyleSheet, View, ViewProps } from 'react-native';
import { KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller';
import { KeyboardView, ThemedView } from '.';
import { AppHeader } from '@shared/components/navigation';

interface ThemedScreenProps {
    children: React.ReactNode;
    theme?: ITheme;
    preset?: 'fixed' | 'scroll';
    headerComponent?: React.ReactNode;
    headerProps?: any; // Replace 'any' with the actual type of AppHeaderProps if available
    showStatusBar?: boolean;
    statusBarProps?: React.ComponentProps<typeof StatusBar>;
    containerStyle?: ViewProps['style'];
    keyboardViewProps?: KeyboardAwareScrollViewProps;
}

const ThemedScreen: React.FC<ThemedScreenProps> = ({
    children,
    theme,
    preset = 'fixed',
    headerComponent,
    headerProps,
    showStatusBar = true,
    statusBarProps,
    containerStyle,
    keyboardViewProps,
}) => {
    const { theme: appTheme } = useAppTheme();
    const activeTheme = theme || appTheme;
    const colors = COLORS[activeTheme];

    const Container = preset === 'scroll' ? KeyboardView : ThemedView;

    return (
        <View style={[styles.root, { backgroundColor: colors.background }]}>
            {showStatusBar && (
                <StatusBar
                    barStyle={activeTheme === 'dark' ? 'light-content' : 'dark-content'}
                    {...statusBarProps}
                />
            )}

            {headerComponent ? headerComponent : headerProps ? (
                <AppHeader theme={activeTheme} {...headerProps} />
            ) : null}

            <Container
                theme={activeTheme}
                style={[styles.container, containerStyle]}
                {...(preset === 'scroll' ? keyboardViewProps : {})}
            >
                {children}
            </Container>
        </View>
    );
};

export default React.memo(ThemedScreen);

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
});
