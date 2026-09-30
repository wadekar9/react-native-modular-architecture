import { COLORS } from '@shared/constants/colors.constants';
import { useAppTheme } from '@shared/hooks';
import { ITheme } from '@shared/types/dto';
import React from 'react'
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller'

interface KeyboardViewProps extends KeyboardAwareScrollViewProps {
    children: React.ReactNode;
    theme?: ITheme;
}

const KeyboardView = React.forwardRef<any, KeyboardViewProps>((props, ref) => {
    const { children, theme, contentContainerStyle, ...remainingProps } = props;
    const { theme: appTheme } = useAppTheme();

    const activeTheme = theme || appTheme;
    const colors = COLORS[activeTheme];

    return (
        <KeyboardAwareScrollView
            ref={ref}
            bounces={false}
            overScrollMode={'never'}
            bouncesZoom={false}
            keyboardDismissMode={'interactive'}
            bottomOffset={25}
            automaticallyAdjustKeyboardInsets={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            contentContainerStyle={[{ backgroundColor: colors.background }, contentContainerStyle]}
            {...remainingProps}
        >
            {children}
        </KeyboardAwareScrollView>
    )
})

export default React.memo(KeyboardView);