import React from 'react';
import { ActivityIndicator, FlatList, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { ArrowRight, Search, ShoppingBag } from 'lucide-react-native';
import { IconButton, Skeleton, ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppTranslation } from '@core/i18n';
import { EFoodBottomScreens } from '../../constants/screens.constants';
import type { FoodBottomBarScreenProps } from '../../types/navigation.types';
import { RADIUS, SPACING, moderateScale } from '@shared/constants/styles.constants';
import { RecipeCard, RecipeCardSkeleton, RecipeSortControl } from '../../components';
import { useFoodHome } from '../../hooks';
import { styling } from './styles';

const separatorStyles = StyleSheet.create({ item: { height: SPACING.SM } });
const RecipeSeparator = () => <View style={separatorStyles.item} />;

const FoodHome: React.FC<FoodBottomBarScreenProps<EFoodBottomScreens.FOOD_HOME>> = () => {
  const { colors, theme } = useAppTheme();
  const { food_t } = useAppTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const {
    cartCount,
    demoPrice,
    featuredRecipe,
    listRecipes,
    tags,
    totalRecipes,
    sortBy,
    order,
    isTagsLoading,
    isLoading,
    isError,
    isRefreshing,
    isFetchingNextPage,
    openRecipe,
    openTag,
    openSearch,
    openCart,
    openOrders,
    getQuantity,
    addRecipe,
    selectSort,
    loadMore,
    refresh,
    retry,
  } = useFoodHome();

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.topRow}>
        <View style={styles.headingCopy}>
          <ThemeText variant="body5" style={styles.eyebrow}>{food_t('EYEBROW')}</ThemeText>
          <ThemeText variant="h1" style={styles.title}>{food_t('TITLE')}</ThemeText>
        </View>
        <IconButton
          accessibilityRole="button"
          accessibilityLabel={food_t('BASKET_ACCESSIBILITY', { count: cartCount })}
          onPress={openCart}
          style={styles.cartButton}
        >
          <ShoppingBag size={20} color={colors['text-primary']} />
          {cartCount > 0 ? (
            <View style={styles.cartBadge}>
              <ThemeText variant="body5" style={styles.badgeText}>{cartCount}</ThemeText>
            </View>
          ) : null}
        </IconButton>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={food_t('SEARCH_RECIPES')}
        onPress={openSearch}
        style={styles.searchEntry}
      >
        <Search size={19} color={colors['icon-muted']} />
        <ThemeText variant="body5" style={styles.searchPlaceholder}>
          {food_t('SEARCH_PLACEHOLDER')}
        </ThemeText>
      </Pressable>

      {featuredRecipe ? (
        <Pressable accessibilityRole="button" onPress={() => openRecipe(featuredRecipe.id)} style={styles.featured}>
          <ImageBackground source={{ uri: featuredRecipe.image }} style={styles.hero} imageStyle={styles.heroImage}>
            <View style={styles.heroShade} />
            <View style={styles.heroContent}>
              <ThemeText variant="body5" style={styles.featuredEyebrow}>
                {food_t('FEATURED_RECIPE', { cuisine: featuredRecipe.cuisine.toUpperCase() })}
              </ThemeText>
              <ThemeText variant="h2" style={styles.heroTitle} numberOfLines={2}>{featuredRecipe.name}</ThemeText>
              <View style={styles.heroMeta}>
                <ThemeText variant="body5" style={styles.heroMetaText}>
                  {food_t('RATING_TIME', {
                    rating: featuredRecipe.rating.toFixed(1),
                    time: featuredRecipe.prepTimeMinutes + featuredRecipe.cookTimeMinutes,
                  })}
                </ThemeText>
                <ArrowRight size={16} color="#FFFFFF" />
              </View>
            </View>
          </ImageBackground>
        </Pressable>
      ) : null}

      <View style={styles.sectionHeading}>
        <View style={styles.sectionCopy}>
          <ThemeText variant="h3">{food_t('BROWSE_BY_TAG')}</ThemeText>
          <ThemeText variant="body5" style={styles.secondary}>{food_t('TAG_SUBTITLE')}</ThemeText>
        </View>
      </View>

      {isTagsLoading && tags.length === 0 ? (
        <View style={styles.tagSkeletonRow}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`tag-skel-${i}`} width={moderateScale(75 + (i % 2) * 20)} height={moderateScale(32)} borderRadius={RADIUS.FULL} />
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          data={tags}
          keyExtractor={tag => tag}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagList}
          renderItem={({ item }) => (
            <Pressable onPress={() => openTag(item)} style={styles.tagChip}>
              <ThemeText variant="body5" style={styles.tagLabel}>{item}</ThemeText>
            </Pressable>
          )}
        />
      )}

      <View style={styles.listHeading}>
        <View>
          <ThemeText variant="h3">{food_t('ALL_RECIPES')}</ThemeText>
          <ThemeText variant="body5" style={styles.secondary}>
            {food_t('TOTAL_RECIPES', { count: totalRecipes })}
          </ThemeText>
        </View>
        <Pressable onPress={openOrders} style={styles.ordersLink}>
          <ThemeText variant="body5" style={styles.ordersLabel}>{food_t('MY_ORDERS')}</ThemeText>
        </Pressable>
      </View>
      <RecipeSortControl sortBy={sortBy} order={order} onChange={selectSort} />
    </View>
  );

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={listRecipes}
        keyExtractor={recipe => String(recipe.id)}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.45}
        refreshing={isRefreshing}
        onRefresh={refresh}
        renderItem={({ item }) => {
          return (
            <RecipeCard
              recipe={item}
              demoPrice={demoPrice}
              quantity={getQuantity(item.id)}
              onPress={() => openRecipe(item.id)}
              onAdd={() => addRecipe(item)}
            />
          );
        }}
        ItemSeparatorComponent={RecipeSeparator}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.recipeSkeletonContainer}>
              {Array.from({ length: 4 }).map((_, index) => (
                <RecipeCardSkeleton key={`recipe-skeleton-${index}`} />
              ))}
            </View>
          ) : isError ? (
            <View style={styles.stateContainer}>
              <ThemeText variant="h4">{food_t('RECIPES_LOAD_ERROR')}</ThemeText>
              <ThemeText variant="body5" style={styles.secondary}>{food_t('CHECK_CONNECTION')}</ThemeText>
              <Pressable onPress={retry} style={styles.retryButton}>
                <ThemeText variant="body5" style={styles.retryLabel}>{food_t('RETRY')}</ThemeText>
              </Pressable>
            </View>
          ) : null
        }
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={styles.footerLoader} color={colors['brand-primary']} /> : null}
      />
    </ThemedView>
  );
};

export default FoodHome;