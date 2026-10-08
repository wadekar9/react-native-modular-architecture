import React, { useEffect, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  Easing,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@shared/hooks/app-theme.hook';
import { RADIUS } from '@shared/constants/styles.constants';

export interface SkeletonProps {
  /** Width of the skeleton block. Defaults to '100%'. */
  width?: DimensionValue;
  /** Height of the skeleton block. Defaults to 16. */
  height?: DimensionValue;
  /** Border radius of the block. Defaults to RADIUS.SM (8). */
  borderRadius?: number;
  /** Convenience prop to render a circle (width and height will be equal). */
  circle?: boolean;
  /** Custom styles to apply to the skeleton container. */
  style?: StyleProp<ViewStyle>;
  /** Animation type: 'pulse' for smooth opacity pulsing, or 'none'. Defaults to 'pulse'. */
  animation?: 'pulse' | 'none';
  /** Cycle duration in milliseconds. Defaults to 900ms. */
  duration?: number;
  /** Override base background color. Defaults to theme 'surface-alt'. */
  color?: string;
  /** Accessibility label for screen readers. Defaults to 'Loading content'. */
  accessibilityLabel?: string;
  children?: React.ReactNode;
}

declare const process: { env?: { NODE_ENV?: string } } | undefined;

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = RADIUS.SM,
  circle = false,
  style,
  animation = 'pulse',
  duration = 900,
  color,
  accessibilityLabel = 'Loading content',
  children,
}) => {
  const { colors } = useAppTheme();
  const animatedOpacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const isTestEnv = typeof process !== 'undefined' && process?.env?.NODE_ENV === 'test';
    if (animation === 'none' || isTestEnv) {
      animatedOpacity.setValue(1);
      return;
    }

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 0.95,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.45,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [animation, duration, animatedOpacity]);

  const resolvedWidth = circle ? (typeof height === 'number' ? height : width) : width;
  const resolvedHeight = circle ? resolvedWidth : height;
  const resolvedRadius = circle ? RADIUS.FULL : borderRadius;
  const backgroundColor = color ?? colors['surface-alt'];

  return (
    <Animated.View
      accessible
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      style={[
        styles.skeleton,
        {
          width: resolvedWidth,
          height: resolvedHeight,
          borderRadius: resolvedRadius,
          backgroundColor,
          opacity: animatedOpacity,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});

export default Skeleton;
