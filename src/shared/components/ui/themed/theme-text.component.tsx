import { COLORS } from '@shared/constants/colors.constants';
import { useAppTheme } from '@shared/hooks';
import { typography, TypographyVariant } from '@shared/styles/typography';
import React from 'react';
import { Text, TextStyle, StyleProp, TextProps } from 'react-native';

interface ThemeTextProps extends Omit<TextProps, 'style'> {
  variant?: TypographyVariant;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const ThemeText: React.FC<ThemeTextProps> = ({
  variant = 'body1',
  style,
  children,
  ...props
}) => {
  const { theme } = useAppTheme();
  return (
    <Text
      accessible={true}
      numberOfLines={1}
      {...props}
      style={[{ color: COLORS[theme]['text-primary'] }, typography[variant], style]}
    >
      {children}
    </Text>
  );
};

export default ThemeText;