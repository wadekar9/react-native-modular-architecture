import React from 'react';
import { DimensionValue, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@shared/hooks/app-theme.hook';
import { RADIUS, SPACING, moderateScale } from '@shared/constants/styles.constants';
import Skeleton from './skeleton.component';
import SkeletonText from './skeleton-text.component';

export interface SkeletonCardProps {
  /** Height of the media/image placeholder box. Defaults to 160. */
  mediaHeight?: DimensionValue;
  /** Custom container style. */
  style?: StyleProp<ViewStyle>;
  /** Border radius of the entire card. Defaults to RADIUS.MD (12). */
  borderRadius?: number;
  /** Whether to show a media placeholder on top. Defaults to true. */
  showMedia?: boolean;
  /** Number of text placeholder lines inside the card body. Defaults to 2. */
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  mediaHeight = moderateScale(160),
  style,
  borderRadius = RADIUS.MD,
  showMedia = true,
  lines = 2,
}) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {showMedia ? (
        <Skeleton
          width="100%"
          height={mediaHeight}
          borderRadius={0}
          style={styles.media}
        />
      ) : null}
      <View style={styles.body}>
        <Skeleton width="75%" height={moderateScale(18)} borderRadius={RADIUS.SM} />
        <SkeletonText lines={lines} lineHeight={moderateScale(12)} lastLineWidth="45%" />
        <View style={styles.footer}>
          <Skeleton width={moderateScale(60)} height={moderateScale(16)} borderRadius={RADIUS.SM} />
          <Skeleton width={moderateScale(70)} height={moderateScale(28)} borderRadius={RADIUS.FULL} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    marginVertical: SPACING.XS,
  },
  media: {
    borderTopLeftRadius: RADIUS.MD,
    borderTopRightRadius: RADIUS.MD,
  },
  body: {
    padding: SPACING.MD,
    gap: SPACING.SM,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.XS,
  },
});

export default SkeletonCard;
