import { StyleSheet } from 'react-native'
import React from 'react'
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { ITheme } from '@shared/types/theme.types';
import { moderateScale, EFonts } from '@shared/constants/styles.constants';
import { IconButton } from '@shared/components/ui';

interface TabBarButtonProps extends BottomTabBarButtonProps {
    theme: ITheme;
    icons: {
        focused: () => React.ReactNode;
        unfocused: () => React.ReactNode;
    }
}

const TabBarButton: React.FC<TabBarButtonProps> = (props: any) => {

    const {
        icons,
        style,
        delayLongPress,
        disabled,
        onLongPress,
        onBlur,
        onFocus,
        pressRetentionOffset,
        pressOpacity = 0.65,
        ...remainingProps
    } = props;

    const isFocused = remainingProps.accessibilityState?.selected;

    return (
                <IconButton
            activeOpacity={pressOpacity}
            {...remainingProps}
            disabled={disabled ?? undefined}
            onLongPress={onLongPress ?? undefined}
            delayLongPress={delayLongPress ?? undefined}
            onBlur={onBlur ?? undefined}
            onFocus={onFocus ?? undefined}
            pressRetentionOffset={pressRetentionOffset ?? undefined}
            style={[styles.container, style]}
        >
            {isFocused ? icons.focused() : icons.unfocused()}
        </IconButton>
    )
}

export default TabBarButton

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontFamily: EFonts.BOLD,
        fontSize: moderateScale(12),
        textAlign: 'center',
        lineHeight: moderateScale(20)
    }
})