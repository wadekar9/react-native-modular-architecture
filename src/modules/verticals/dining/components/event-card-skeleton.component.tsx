import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@shared/components/ui/skeleton';
import { useAppTheme } from '@shared/hooks/app-theme.hook';
import { COLORS } from '@shared/constants/colors.constants';
import { moderateScale, RADIUS, SPACING } from '@shared/constants/styles.constants';

type EventCardSkeletonProps = {
  featured?: boolean;
};

export const EventCardSkeleton: React.FC<EventCardSkeletonProps> = ({ featured = false }) => {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const imageHeight = featured ? moderateScale(214) : moderateScale(176);

  return (
    <View style={[styles.card, featured && styles.featuredCard]} accessible={false}>
      {/* Event media banner placeholder */}
      <View style={[styles.mediaContainer, { height: imageHeight }]}>
        <Skeleton width="100%" height={imageHeight} borderRadius={0} style={styles.imageRadius} />
        <View style={styles.captionOverlay}>
          <Skeleton width={moderateScale(70)} height={moderateScale(20)} borderRadius={RADIUS.XS} />
          <Skeleton width="80%" height={moderateScale(22)} borderRadius={RADIUS.XS} />
          <Skeleton width="45%" height={moderateScale(13)} borderRadius={RADIUS.XS} />
        </View>
      </View>

      {/* Details section */}
      <View style={styles.details}>
        <View style={styles.detailLine}>
          <Skeleton width={moderateScale(16)} height={moderateScale(16)} circle />
          <Skeleton width="55%" height={moderateScale(13)} borderRadius={RADIUS.XS} />
        </View>
        <View style={styles.detailLine}>
          <Skeleton width={moderateScale(16)} height={moderateScale(16)} circle />
          <Skeleton width="70%" height={moderateScale(13)} borderRadius={RADIUS.XS} />
        </View>

        {/* Footer line */}
        <View style={styles.footer}>
          <Skeleton width={moderateScale(90)} height={moderateScale(20)} borderRadius={RADIUS.XS} />
          <Skeleton width={moderateScale(60)} height={moderateScale(14)} borderRadius={RADIUS.XS} />
        </View>
      </View>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    card: {
      overflow: 'hidden',
      borderRadius: RADIUS.MD,
      backgroundColor: COLORS[theme].surface,
      borderWidth: 1,
      borderColor: COLORS[theme].border,
    },
    featuredCard: {
      marginBottom: SPACING.SM,
    },
    mediaContainer: {
      position: 'relative',
    },
    imageRadius: {
      borderTopLeftRadius: RADIUS.MD,
      borderTopRightRadius: RADIUS.MD,
    },
    captionOverlay: {
      position: 'absolute',
      bottom: SPACING.MD,
      left: SPACING.MD,
      right: SPACING.MD,
      gap: SPACING.XS,
    },
    details: {
      paddingHorizontal: SPACING.MD,
      paddingVertical: SPACING.SM,
      gap: moderateScale(9),
    },
    detailLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SM,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: COLORS[theme].border,
      paddingTop: SPACING.SM,
      marginTop: moderateScale(2),
    },
  });

export default EventCardSkeleton;
