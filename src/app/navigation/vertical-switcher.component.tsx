import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import type { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { useAppTheme } from '@shared/hooks';
import { ITheme } from '@shared/types/theme.types';
import { COLORS } from '@shared/constants/colors.constants';

const VerticalSwitcher = ({ state, descriptors, navigation }: MaterialTopTabBarProps) => {
  const { theme } = useAppTheme();
  const styles = styling(theme);

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
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tab, focused && styles.selectedTab]}
          >
            <Text style={[styles.label, focused && styles.selectedLabel]}>{title}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styling = (theme: ITheme) => StyleSheet.create({
  bar: {
    flexGrow: 0,
    backgroundColor: COLORS[theme].surface,
  },
  tab: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomColor: COLORS[theme]['brand-primary']
  },
  label: {
    color: COLORS[theme]['text-secondary'],
  },
  selectedLabel: {
    color: COLORS[theme]['brand-primary'],
  },
});

export default VerticalSwitcher;