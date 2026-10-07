import React from 'react';
import { Pressable, View } from 'react-native';
import { ThemeText } from '@shared/components/ui';
import type { RecipeSortField, RecipeSortOrder } from '../../types/recipe.types';
import { useAppTheme } from '@shared/hooks';
import { styling } from './recipe-sort-control.styles';

type RecipeSortControlProps = {
  sortBy: RecipeSortField;
  order: RecipeSortOrder;
  onChange: (sortBy: RecipeSortField, order: RecipeSortOrder) => void;
};

const SORT_OPTIONS: { label: string; sortBy: RecipeSortField; order: RecipeSortOrder }[] = [
  { label: 'Top rated', sortBy: 'rating', order: 'desc' },
  { label: 'A to Z', sortBy: 'name', order: 'asc' },
  { label: 'Quickest', sortBy: 'prepTimeMinutes', order: 'asc' },
];

const RecipeSortControl: React.FC<RecipeSortControlProps> = ({ sortBy, order, onChange }) => {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  return (
    <View style={styles.options}>
      {SORT_OPTIONS.map(option => {
        const selected = sortBy === option.sortBy && order === option.order;
        return (
          <Pressable
            key={option.label}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.sortBy, option.order)}
            style={[styles.option, selected && styles.selectedOption]}
          >
            <ThemeText variant="body5" style={[styles.label, selected && styles.selectedLabel]}>{option.label}</ThemeText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default RecipeSortControl;