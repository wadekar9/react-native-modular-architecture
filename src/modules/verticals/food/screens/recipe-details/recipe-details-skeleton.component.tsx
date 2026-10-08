import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from '@shared/components/ui/skeleton';
import { useAppTheme } from '@shared/hooks/app-theme.hook';
import { COLORS } from '@shared/constants/colors.constants';
import { moderateScale, RADIUS, SPACING } from '@shared/constants/styles.constants';

export const RecipeDetailsSkeleton: React.FC = () => {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  return (
    <View style={[styles.screen, { backgroundColor: COLORS[theme].background }]} accessible={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero image placeholder */}
        <View style={styles.hero}>
          <Skeleton width="100%" height={moderateScale(310)} borderRadius={0} />
          <View style={styles.heroOverlay}>
            <Skeleton width="30%" height={moderateScale(12)} borderRadius={RADIUS.XS} />
            <Skeleton width="75%" height={moderateScale(26)} borderRadius={RADIUS.SM} />
            <Skeleton width="40%" height={moderateScale(14)} borderRadius={RADIUS.XS} />
          </View>
        </View>

        {/* Metrics Row */}
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Skeleton width={moderateScale(24)} height={moderateScale(24)} circle />
            <Skeleton width={moderateScale(50)} height={moderateScale(16)} borderRadius={RADIUS.XS} />
            <Skeleton width={moderateScale(60)} height={moderateScale(11)} borderRadius={RADIUS.XS} />
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Skeleton width={moderateScale(24)} height={moderateScale(24)} circle />
            <Skeleton width={moderateScale(40)} height={moderateScale(16)} borderRadius={RADIUS.XS} />
            <Skeleton width={moderateScale(50)} height={moderateScale(11)} borderRadius={RADIUS.XS} />
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Skeleton width={moderateScale(24)} height={moderateScale(24)} circle />
            <Skeleton width={moderateScale(45)} height={moderateScale(16)} borderRadius={RADIUS.XS} />
            <Skeleton width={moderateScale(65)} height={moderateScale(11)} borderRadius={RADIUS.XS} />
          </View>
        </View>

        {/* Meta Line */}
        <View style={styles.metaLine}>
          <Skeleton width={moderateScale(60)} height={moderateScale(14)} borderRadius={RADIUS.XS} />
          <Skeleton width={moderateScale(160)} height={moderateScale(14)} borderRadius={RADIUS.XS} />
        </View>

        {/* Ingredients section */}
        <View style={styles.section}>
          <Skeleton width="45%" height={moderateScale(20)} borderRadius={RADIUS.SM} />
          <View style={styles.ingredientList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={`ing-skeleton-${i}`} style={styles.ingredientRow}>
                <Skeleton width={moderateScale(8)} height={moderateScale(8)} circle />
                <Skeleton width={`${70 + (i % 3) * 10}%`} height={moderateScale(14)} borderRadius={RADIUS.XS} />
              </View>
            ))}
          </View>
        </View>

        {/* Method section */}
        <View style={styles.section}>
          <Skeleton width="35%" height={moderateScale(20)} borderRadius={RADIUS.SM} />
          <View style={styles.methodList}>
            {Array.from({ length: 3 }).map((_, i) => (
              <View key={`step-skeleton-${i}`} style={styles.stepRow}>
                <Skeleton width={moderateScale(26)} height={moderateScale(26)} circle />
                <View style={styles.stepLines}>
                  <Skeleton width="100%" height={moderateScale(13)} borderRadius={RADIUS.XS} />
                  <Skeleton width="80%" height={moderateScale(13)} borderRadius={RADIUS.XS} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceColumn}>
          <Skeleton width={moderateScale(70)} height={moderateScale(11)} borderRadius={RADIUS.XS} />
          <Skeleton width={moderateScale(60)} height={moderateScale(22)} borderRadius={RADIUS.XS} />
        </View>
        <Skeleton width={moderateScale(150)} height={moderateScale(46)} borderRadius={RADIUS.MD} />
      </View>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    screen: { flex: 1 },
    content: { paddingBottom: moderateScale(110) },
    hero: { position: 'relative' },
    heroOverlay: {
      position: 'absolute',
      bottom: SPACING.MD,
      left: SPACING.MD,
      right: SPACING.MD,
      gap: SPACING.XS,
    },
    metrics: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingVertical: SPACING.MD,
      marginHorizontal: SPACING.MD,
      marginTop: SPACING.MD,
      borderRadius: RADIUS.MD,
      backgroundColor: COLORS[theme].surface,
      borderWidth: 1,
      borderColor: COLORS[theme].border,
    },
    metric: { alignItems: 'center', gap: moderateScale(4) },
    metricDivider: { width: 1, height: moderateScale(36), backgroundColor: COLORS[theme].border },
    metaLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.MD,
      marginTop: SPACING.MD,
    },
    section: {
      paddingHorizontal: SPACING.MD,
      marginTop: SPACING.LG,
      gap: SPACING.SM,
    },
    ingredientList: { gap: SPACING.SM },
    ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.SM },
    methodList: { gap: SPACING.MD },
    stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.SM },
    stepLines: { flex: 1, gap: SPACING.XS },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.MD,
      paddingVertical: SPACING.MD,
      backgroundColor: COLORS[theme].surface,
      borderTopWidth: 1,
      borderTopColor: COLORS[theme].border,
    },
    priceColumn: { gap: SPACING.XS },
  });

export default RecipeDetailsSkeleton;
