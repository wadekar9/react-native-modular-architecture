import React from 'react';
import { DimensionValue, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SPACING, moderateScale } from '@shared/constants/styles.constants';
import Skeleton from './skeleton.component';

export interface SkeletonTextProps {
  /** Number of text lines to display. Defaults to 3. */
  lines?: number;
  /** Height of each text line. Defaults to 14. */
  lineHeight?: number;
  /** Gap between text lines. Defaults to SPACING.SM (8). */
  gap?: number;
  /** Width of the last line to simulate natural paragraph ending. Defaults to '60%'. */
  lastLineWidth?: DimensionValue;
  /** Custom container style. */
  style?: StyleProp<ViewStyle>;
  /** Border radius for each line. Defaults to 6. */
  borderRadius?: number;
  /** Animation type. Defaults to 'pulse'. */
  animation?: 'pulse' | 'none';
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lineHeight = moderateScale(14),
  gap = SPACING.SM,
  lastLineWidth = '60%',
  style,
  borderRadius = moderateScale(6),
  animation = 'pulse',
}) => {
  return (
    <View style={[styles.container, { gap }, style]}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1;
        const width: DimensionValue = isLast && lines > 1 ? lastLineWidth : '100%';
        return (
          <Skeleton
            key={`skeleton-line-${index}`}
            width={width}
            height={lineHeight}
            borderRadius={borderRadius}
            animation={animation}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default SkeletonText;
