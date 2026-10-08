import React, { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeft, Search, ShoppingBag } from 'lucide-react-native';
import { IconButton, ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { SPACING } from '@shared/constants/styles.constants';
import type { FoodStackScreenProps } from '../../types/navigation.types';
import { RecipeCard, RecipeCardSkeleton, RecipeFilterBar, RecipeSearchField } from '../../components';
import { useFoodSearch, useFoodTranslation } from '../../hooks';
import { styling } from './styles';
import { EFoodStackScreens } from '../../constants/screens.constants';

const FoodSearch: React.FC<FoodStackScreenProps<EFoodStackScreens.FOOD_SEARCH>> = () => {
  const { colors, theme } = useAppTheme();
  const { food_t } = useFoodTranslation();
  const styles = useMemo(() => styling(theme), [theme]);
  const {
    search: query,
    setSearch: setQuery,
    tags,
    mealTypes,
    selectedTag,
    selectedMealType,
    sortBy,
    order,
    setTag,
    setMealType,
    setSort,
    clearFilters,
    getQuantity,
    addRecipe,
    goBack,
    openCart,
    openRecipe,
    retry,
    total,
    isLoading,
    isError,
    demoPrice,
    hasActiveFilters,
    recipes,
    cartCount,
  } = useFoodSearch();

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <IconButton
          accessibilityRole="button"
          accessibilityLabel={food_t('BACK_TO_MENU')}
          onPress={goBack}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color={colors['text-primary']} />
        </IconButton>
        <ThemeText variant="h3" style={styles.headerTitle}>{food_t('FIND_A_RECIPE')}</ThemeText>
        <IconButton
          accessibilityRole="button"
          accessibilityLabel={food_t('OPEN_BASKET_ACCESSIBILITY', { count: cartCount })}
          onPress={openCart}
          style={styles.cartButton}
        >
          <ShoppingBag size={19} color={colors['text-primary']} />
          {cartCount > 0 ? (
            <View style={styles.cartBadge}>
              <ThemeText variant="body5" style={styles.badgeText}>{cartCount}</ThemeText>
            </View>
          ) : null}
        </IconButton>
      </View>

      <RecipeSearchField autoFocus value={query} onChangeText={setQuery} />
      <RecipeFilterBar
        tags={tags}
        mealTypes={mealTypes}
        selectedTag={selectedTag}
        selectedMealType={selectedMealType}
        sortBy={sortBy}
        order={order}
        onTagChange={setTag}
        onMealTypeChange={setMealType}
        onSortChange={setSort}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <ScrollView contentContainerStyle={styles.results} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeading}>
          <View>
            <ThemeText variant="h3">
              {query ? food_t('SEARCH_RESULTS') : selectedTag || selectedMealType || food_t('EXPLORE_RECIPES')}
            </ThemeText>
            <ThemeText variant="body5" style={styles.resultCount}>
              {total === 1 ? food_t('RECIPE_COUNT_ONE', { count: total }) : food_t('RECIPE_COUNT_OTHER', { count: total })}
            </ThemeText>
          </View>
        </View>

        {isLoading ? (
          <View style={{ gap: SPACING.SM }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <RecipeCardSkeleton key={`search-skeleton-${index}`} />
            ))}
          </View>
        ) : isError ? (
          <View style={styles.emptyState}>
            <ThemeText variant="h4">{food_t('RECIPES_LOAD_ERROR')}</ThemeText>
            <ThemeText variant="body5" style={styles.emptyCopy}>{food_t('CHECK_CONNECTION')}</ThemeText>
            <Pressable onPress={retry} style={styles.resetButton}>
              <ThemeText variant="body5" style={styles.resetLabel}>{food_t('RETRY')}</ThemeText>
            </Pressable>
          </View>
        ) : recipes.length > 0 ? recipes.map(recipe => {
          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              demoPrice={demoPrice}
              quantity={getQuantity(recipe.id)}
              onPress={() => openRecipe(recipe.id)}
              onAdd={() => addRecipe(recipe)}
            />
          );
        }) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><Search size={23} color={colors['icon-muted']} /></View>
            <ThemeText variant="h4">{food_t('NO_RECIPES_FOUND')}</ThemeText>
            <ThemeText variant="body5" style={styles.emptyCopy}>{food_t('TRY_ANOTHER_SEARCH')}</ThemeText>
            <Pressable onPress={clearFilters} style={styles.resetButton}>
              <ThemeText variant="body5" style={styles.resetLabel}>{food_t('CLEAR_FILTERS')}</ThemeText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default FoodSearch;