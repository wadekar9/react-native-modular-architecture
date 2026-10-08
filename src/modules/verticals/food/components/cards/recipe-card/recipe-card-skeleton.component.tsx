import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@shared/components/ui/skeleton';
import { useAppTheme } from '@shared/hooks/app-theme.hook';
import { COLORS } from '@shared/constants/colors.constants';
import { moderateScale, RADIUS, SPACING } from '@shared/constants/styles.constants';

export const RecipeCardSkeleton: React.FC = () => {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  return (
    <View style={styles.card} accessible={false}>
      {/* Recipe image placeholder */}
      <Skeleton
        width={moderateScale(88)}
        height={moderateScale(100)}
        borderRadius={RADIUS.SM}
      />

      {/* Content column */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Skeleton width="68%" height={moderateScale(15)} borderRadius={RADIUS.XS} />
          <Skeleton width={moderateScale(32)} height={moderateScale(13)} borderRadius={RADIUS.XS} />
        </View>

        <Skeleton width="48%" height={moderateScale(11)} borderRadius={RADIUS.XS} />

        <View style={styles.tagRow}>
          <Skeleton width={moderateScale(46)} height={moderateScale(16)} borderRadius={RADIUS.XS} />
          <Skeleton width={moderateScale(54)} height={moderateScale(16)} borderRadius={RADIUS.XS} />
        </View>

        <View style={styles.footer}>
          <Skeleton width={moderateScale(50)} height={moderateScale(12)} borderRadius={RADIUS.XS} />
          <Skeleton width={moderateScale(42)} height={moderateScale(15)} borderRadius={RADIUS.XS} />
        </View>
      </View>

      {/* Add button placeholder */}
      <Skeleton
        width={moderateScale(58)}
        height={moderateScale(40)}
        borderRadius={RADIUS.SM}
      />
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SM,
      padding: SPACING.SM,
      borderWidth: 1,
      borderColor: COLORS[theme].border,
      borderRadius: RADIUS.MD,
      backgroundColor: COLORS[theme].surface,
    },
    content: {
      flex: 1,
      minWidth: 0,
      gap: SPACING.XS,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPACING.XS,
    },
    tagRow: {
      flexDirection: 'row',
      gap: SPACING.XS,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPACING.XS,
      marginTop: moderateScale(2),
    },
  });

export default RecipeCardSkeleton;
