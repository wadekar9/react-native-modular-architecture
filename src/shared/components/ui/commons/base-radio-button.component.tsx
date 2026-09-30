import { StyleSheet, TouchableOpacity, Animated, StyleProp, TextStyle, TouchableOpacityProps, View } from 'react-native'
import React from 'react'
import { ThemeText } from '../themed';
import { useAppTheme } from '@shared/hooks';
import { EFonts, moderateScale } from '@shared/constants/styles.constants';
import { ITheme } from '@shared/types/theme.types';
import { COLORS } from '@shared/constants/colors.constants';

interface BaseRadioButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  value: boolean;
  onValueChange: (e: boolean) => void;
  size?: number;
}

interface BaseLabelRadioButtonProps extends BaseRadioButtonProps {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
}

const BaseRadioButton: React.FC<BaseRadioButtonProps> = ({
  disabled = false,
  size = 22,
  value,
  onValueChange,
  ...props
}) => {

  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, opacity]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...props}
      style={[
        styles.wrapper,
        disabled && styles.disabledOpacity,
        { width: moderateScale(size), height: moderateScale(size), borderRadius: moderateScale(size / 2) }
      ]}
      onPress={(e) => {
        onValueChange(!value);
        if (props.onPress) props.onPress(e);
      }}
      disabled={disabled}
      accessibilityRole={props.accessibilityRole || "radio"}
      accessibilityState={{ ...props.accessibilityState, checked: value, disabled }}
    >
      <Animated.View
        style={[
          styles.container,
          { opacity, width: moderateScale(size / 1.8), height: moderateScale(size / 1.8) }
        ]}
      />
    </TouchableOpacity>
  )
}

export const BaseLabelRadioButton: React.FC<BaseLabelRadioButtonProps> = ({
  label,
  ...props
}) => {

  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  return (
    <TouchableOpacity
      style={[styles.flexWrapper, props.disabled && styles.disabledOpacity]}
      activeOpacity={0.7}
      onPress={() => props.onValueChange(!props.value)}
      disabled={props.disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: props.value, disabled: props.disabled }}
      accessibilityLabel={label}
    >
      <View pointerEvents="none">
        <BaseRadioButton {...props} />
      </View>
      <ThemeText style={[styles.label, props.labelStyle]}>{label}</ThemeText>
    </TouchableOpacity>
  )
}

export default React.memo(BaseRadioButton);

const styling = (theme: ITheme) => StyleSheet.create({
  disabledOpacity: {
    opacity: 0.7,
  },
  wrapper: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderWidth: moderateScale(2),
    borderColor: COLORS[theme]['brand-primary'],
    borderRadius: moderateScale(11),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    width: moderateScale(12),
    height: moderateScale(12),
    backgroundColor: COLORS[theme]['brand-primary'],
    borderRadius: moderateScale(100),
  },
  flexWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10)
  },
  label: {
    fontFamily: EFonts.MEDIUM,
    textTransform: 'capitalize',
    color: COLORS[theme]['text-primary'],
    fontSize: moderateScale(14)
  }
})