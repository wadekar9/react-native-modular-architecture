import { Animated, Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import React from 'react';
import { ITheme } from '@shared/types/theme.types';
import { useAppTheme } from '@shared/hooks';
import { EFonts, moderateScale } from '@shared/constants/styles.constants';
import { COLORS } from '@shared/constants/colors.constants';

interface BasePressableButtonProps extends PressableProps {
    theme?: ITheme;
    label: string;
    labelStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    RightAccessory?: React.ReactNode;
    LeftAccessory?: React.ReactNode;
    outline?: boolean;
}

const BasePressableButton: React.FC<BasePressableButtonProps> = ({
    theme: propTheme,
    label,
    labelStyle,
    containerStyle,
    RightAccessory,
    LeftAccessory,
    disabled,
    outline = false,
    ...props
}) => {
    const { theme: appTheme } = useAppTheme();
    const theme = propTheme || appTheme;
    const styles = React.useMemo(() => styling(theme), [theme]);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = (e: any) => {
        Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
        }).start();
        if (props.onPressIn) props.onPressIn(e);
    };

    const handlePressOut = (e: any) => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
        if (props.onPressOut) props.onPressOut(e);
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.animatedContainer, containerStyle]}>
            <Pressable
                {...props}
                disabled={disabled}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    styles.wrapper,
                    outline && styles.outlineWrapper,
                    disabled && styles.disabledWrapper
                ]}
                accessibilityRole={props.accessibilityRole || "button"}
                accessibilityState={{ ...props.accessibilityState, disabled: !!disabled }}
            >
                {!!LeftAccessory && LeftAccessory}
                <Text style={[styles.label, outline && styles.outlineLabel, labelStyle]}>{label}</Text>
                {!!RightAccessory && RightAccessory}
            </Pressable>
        </Animated.View>
    )
}

export default React.memo(BasePressableButton);

const styling = (theme: ITheme) => StyleSheet.create({
    animatedContainer: {
        width: '100%',
    },
    disabledWrapper: {
        opacity: 0.5,
    },
    wrapper: {
        width: '100%',
        height: moderateScale(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: moderateScale(5),
        gap: moderateScale(10),
        backgroundColor: COLORS[theme]['brand-primary']
    },
    outlineWrapper: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS[theme]['brand-primary']
    },
    label: {
        fontFamily: EFonts.MEDIUM,
        fontSize: moderateScale(15),
        color: COLORS[theme].surface,
        textTransform: 'capitalize'
    },
    outlineLabel: {
        color: COLORS[theme]['brand-primary']
    }
})  