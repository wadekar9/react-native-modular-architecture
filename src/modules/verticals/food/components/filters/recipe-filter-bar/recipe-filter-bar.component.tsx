import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ThemeText } from '@shared/components/ui';
import type { RecipeSortField, RecipeSortOrder } from '../../../types/recipe.types';
import { useAppTheme } from '@shared/hooks';
import { useFoodTranslation } from '../../../hooks';
import RecipeSortControl from '../recipe-sort-control/recipe-sort-control.component';
import { styling } from './recipe-filter-bar.styles';

type RecipeFilterBarProps = {
  tags: string[];
  mealTypes: string[];
  selectedTag: string;
  selectedMealType: string;
  sortBy: RecipeSortField;
  order: RecipeSortOrder;
  onTagChange: (tag: string) => void;
  onMealTypeChange: (mealType: string) => void;
  onSortChange: (sortBy: RecipeSortField, order: RecipeSortOrder) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
};

const RecipeFilterBar: React.FC<RecipeFilterBarProps> = ({
  tags,
  mealTypes,
  selectedTag,
  selectedMealType,
  sortBy,
  order,
  onTagChange,
  onMealTypeChange,
  onSortChange,
  onClear,
  hasActiveFilters,
}) => {
  const { theme } = useAppTheme();
  const { food_t } = useFoodTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const renderChoices = (items: string[], selected: string, allLabel: string, onSelect: (value: string) => void) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>
      <Pressable onPress={() => onSelect('')} style={[styles.choice, !selected && styles.choiceSelected]}>
        <ThemeText variant="body5" style={[styles.choiceLabel, !selected && styles.choiceLabelSelected]}>{allLabel}</ThemeText>
      </Pressable>
      {items.map(item => {
        const active = selected === item;
        return (
          <Pressable key={item} onPress={() => onSelect(active ? '' : item)} style={[styles.choice, active && styles.choiceSelected]}>
            <ThemeText variant="body5" style={[styles.choiceLabel, active && styles.choiceLabelSelected]}>{item}</ThemeText>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterHeading}>
        <ThemeText variant="body5" style={styles.headingLabel}>{food_t('MEAL_TYPE')}</ThemeText>
        {hasActiveFilters ? <Pressable onPress={onClear}><ThemeText variant="body5" style={styles.clearLabel}>{food_t('CLEAR_FILTERS')}</ThemeText></Pressable> : null}
      </View>
      {renderChoices(mealTypes, selectedMealType, food_t('ALL_MEALS'), onMealTypeChange)}
      <ThemeText variant="body5" style={styles.headingLabel}>{food_t('TAG')}</ThemeText>
      {renderChoices(tags, selectedTag, food_t('ALL_TAGS'), onTagChange)}
      <View style={styles.sortRow}>
        <ThemeText variant="body5" style={styles.headingLabel}>{food_t('SORT')}</ThemeText>
        <RecipeSortControl sortBy={sortBy} order={order} onChange={onSortChange} />
      </View>
    </View>
  );
};

export default RecipeFilterBar;