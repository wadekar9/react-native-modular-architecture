import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import type { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { openVertical } from '@core/navigation/types';
import { useAppTheme } from '@shared/hooks';

const VerticalSwitcher = ({ state, descriptors, navigation }: MaterialTopTabBarProps) => {
  const { colors } = useAppTheme();
  const styles = styling(colors);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bar}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const title = descriptors[route.key].options.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            onPress={() => openVertical(name => navigation.navigate(name), route.name)}
            style={[styles.tab, focused && styles.selectedTab]}
          >
            <Text style={[styles.label, focused && styles.selectedLabel]}>{title}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styling = (colors: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  bar: {
    flexGrow: 0,
    backgroundColor: colors.surface,
  },
  tab: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomColor: colors['brand-primary'],
  },
  label: {
    color: colors['text-secondary'],
  },
  selectedLabel: {
    color: colors['brand-primary'],
  },
});

export default VerticalSwitcher;