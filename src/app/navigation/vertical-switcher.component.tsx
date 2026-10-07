import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Settings2 } from 'lucide-react-native';
import type { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { useAppTheme } from '@shared/hooks';
import { IconButton } from '@shared/components/ui';
import { ITheme } from '@shared/types/theme.types';
import { COLORS } from '@shared/constants/colors.constants';
import { useAppTranslation } from '@core/i18n';
import { EStackScreens } from '@shared/constants/screens.constants';
import { moderateScale } from '@shared/constants/styles.constants';

/**
 * ============================================================================
 * VERTICAL SWITCHER TAB BAR
 * ============================================================================
 *
 * This component renders the top tab bar allowing users to switch between
 * active verticals (e.g. Food, Dining, Grocery).
 *
 * HOW IT WORKS DYNAMICALLY:
 * 1. ZERO HARDCODED TABS:
 *    Instead of hardcoding tabs for "Food" and "Dining", it dynamically maps
 *    over `state.routes` provided by `createMaterialTopTabNavigator`.
 *
 * 2. MANIFEST METADATA:
 *    The tab label is extracted from `descriptors[route.key].options.title`, which
 *    originates directly from each vertical's `manifest.title`.
 *
 * 3. FLUID HORIZONTAL SCROLLING:
 *    Wrapped in a horizontal `ScrollView` so as new verticals are registered,
 *    the tab bar scales naturally without layout truncation.
 */
const VerticalSwitcher = ({ state, descriptors, navigation }: MaterialTopTabBarProps) => {
  const { theme } = useAppTheme();
  const { common_t } = useAppTranslation();
  const styles = styling(theme);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const defaultTitle = descriptors[route.key].options.title ?? route.name;
          const title = common_t(`VERTICAL_${route.name.toUpperCase()}`, { defaultValue: defaultTitle });

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.tab, focused && styles.selectedTab]}
            >
              <Text style={[styles.label, focused && styles.selectedLabel]}>{title}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <IconButton
        accessibilityRole="button"
        accessibilityLabel={common_t('SETTINGS')}
        onPress={() => navigation.getParent()?.navigate(EStackScreens.SETTINGS)}
        style={styles.settingsButton}
      >
        <Settings2 size={moderateScale(20)} color={COLORS[theme]['text-primary']} />
      </IconButton>
    </View>
  );
};

const styling = (theme: ITheme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS[theme].surface,
  },
  bar: {
    flex: 1,
    backgroundColor: COLORS[theme].surface,
  },
  settingsButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomColor: COLORS[theme]['brand-primary'],
  },
  label: {
    color: COLORS[theme]['text-secondary'],
  },
  selectedLabel: {
    color: COLORS[theme]['brand-primary'],
  },
});

export default VerticalSwitcher;