import React from 'react'
import BasePressableButton from './base-pressable-button.component';
import { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ITheme } from '@shared/types/theme.types';

interface BaseButtonProps extends PressableProps {
  theme?: ITheme;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  RightAccessory?: React.ReactNode;
  LeftAccessory?: React.ReactNode;
  outline?: boolean;
};

const BaseButton: React.FC<BaseButtonProps> = ({
  theme,
  label,
  labelStyle,
  containerStyle,
  RightAccessory,
  LeftAccessory,
  outline,
  ...props
}) => {
  return (
    <BasePressableButton
      {...props}
      theme={theme}
      label={label}
      labelStyle={labelStyle}
      containerStyle={containerStyle}
      RightAccessory={RightAccessory}
      LeftAccessory={LeftAccessory}
      outline={outline}
    />
  )
}

export default React.memo(BaseButton);