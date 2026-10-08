import React from 'react';
import { Pressable, View } from 'react-native';
import { ThemeText } from '@shared/components/ui';
import type { RecipeSortField, RecipeSortOrder } from '../../types/recipe.types';
import { useAppTheme } from '@shared/hooks';
import { useAppTranslation } from '@core/i18n';
import { styling } from './recipe-sort-control.styles';

type RecipeSortControlProps = {
  sortBy: RecipeSortField;
  order: RecipeSortOrder;
  onChange: (sortBy: RecipeSortField, order: RecipeSortOrder) => void;
};

const SORT_OPTIONS: { key: 'TOP_RATED' | 'A_TO_Z' | 'QUICKEST'; sortBy: RecipeSortField; order: RecipeSortOrder }[] = [
  { key: 'TOP_RATED', sortBy: 'rating', order: 'desc' },
  { key: 'A_TO_Z', sortBy: 'name', order: 'asc' },
  { key: 'QUICKEST', sortBy: 'prepTimeMinutes', order: 'asc' },
];

const RecipeSortControl: React.FC<RecipeSortControlProps> = ({ sortBy, order, onChange }) => {
  const { theme } = useAppTheme();
  const { food_t } = useAppTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);

  return (
    <View style={styles.options}>
      {SORT_OPTIONS.map(option => {
        const selected = sortBy === option.sortBy && order === option.order;
        const label = food_t(option.key);
        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.sortBy, option.order)}
            style={[styles.option, selected && styles.selectedOption]}
          >
            <ThemeText variant="body5" style={[styles.label, selected && styles.selectedLabel]}>{label}</ThemeText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default RecipeSortControl;