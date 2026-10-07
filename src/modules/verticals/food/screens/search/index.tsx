import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, TextInput, View } from 'react-native';
import { ArrowLeft, Search, ShoppingBag, X } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { MENU_CATEGORIES, MENU_ITEMS } from '../../constants/menu.constants';
import { EFoodStackScreens } from '../../constants/screens.constants';
import type { FoodStackScreenProps } from '../../types/navigation.types';
import { addToCart } from '../../store/cart.slice';
import { selectFoodCart } from '../../store/food.selectors';
import { styling } from './styles';

const getCuisine = (category: string) => category.split('·').pop()?.trim() ?? category;

const FoodSearch: React.FC<FoodStackScreenProps<EFoodStackScreens.FOOD_SEARCH>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const styles = useMemo(() => styling(theme), [theme]);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectFoodCart);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const normalizedQuery = query.trim().toLowerCase();
  const results = MENU_ITEMS.filter(item => {
    const matchesText = !normalizedQuery || `${item.title} ${item.category}`.toLowerCase().includes(normalizedQuery);
    const matchesCategory = selectedCategory === 'All' || getCuisine(item.category) === selectedCategory;
    return matchesText && matchesCategory;
  });

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to menu"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color={colors['text-primary']} />
        </Pressable>
        <ThemeText variant="h3" style={styles.headerTitle}>Find something good</ThemeText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open basket, ${cart.count} items`}
          onPress={() => navigation.navigate(EFoodStackScreens.FOOD_CART)}
          style={styles.cartButton}
        >
          <ShoppingBag size={19} color={colors['text-primary']} />
          {cart.count > 0 ? <View style={styles.cartBadge}><ThemeText variant="body5" style={styles.badgeText}>{cart.count}</ThemeText></View> : null}
        </Pressable>
      </View>

      <View style={styles.searchField}>
        <Search size={19} color={colors['icon-muted']} />
        <TextInput
          autoFocus
          value={query}
          onChangeText={setQuery}
          placeholder="Search dishes or cuisines"
          placeholderTextColor={colors['text-muted']}
          returnKeyType="search"
          autoCorrect={false}
          style={styles.searchInput}
          accessibilityLabel="Search food items"
        />
        {query.length > 0 ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} style={styles.clearButton}>
            <X size={17} color={colors['icon-default']} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {MENU_CATEGORIES.map(category => {
          const selected = selectedCategory === category;
          return (
            <Pressable
              key={category}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setSelectedCategory(category)}
              style={[styles.categoryChip, selected && styles.categoryChipSelected]}
            >
              <ThemeText variant="body5" style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}>{category}</ThemeText>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.results} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeading}>
          <View>
            <ThemeText variant="h3">{normalizedQuery ? 'Search results' : 'Popular right now'}</ThemeText>
            <ThemeText variant="body5" style={styles.resultCount}>{results.length} {results.length === 1 ? 'dish' : 'dishes'}</ThemeText>
          </View>
          {selectedCategory !== 'All' ? <ThemeText variant="body5" style={styles.activeFilter}>{selectedCategory}</ThemeText> : null}
        </View>

        {results.length > 0 ? results.map(item => {
          const quantity = cart.items.find(cartItem => cartItem.id === item.id)?.quantity ?? 0;
          return (
            <View key={item.id} style={styles.resultCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <ThemeText variant="body4" numberOfLines={2}>{item.title}</ThemeText>
                <ThemeText variant="body5" numberOfLines={1} style={styles.secondary}>{item.category}</ThemeText>
                <View style={styles.itemFooter}>
                  <ThemeText variant="h4">₹{item.price.toLocaleString('en-IN')}</ThemeText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${item.title} to basket`}
                    onPress={() => dispatch(addToCart(item))}
                    style={styles.addButton}
                  >
                    <ThemeText variant="body5" style={styles.addLabel}>{quantity ? `Add · ${quantity} in basket` : 'Add to basket'}</ThemeText>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><Search size={23} color={colors['icon-muted']} /></View>
            <ThemeText variant="h4">No dishes found</ThemeText>
            <ThemeText variant="body5" style={styles.emptyCopy}>Try another dish or cuisine.</ThemeText>
            <Pressable onPress={() => { setQuery(''); setSelectedCategory('All'); }} style={styles.resetButton}>
              <ThemeText variant="body5" style={styles.resetLabel}>Clear filters</ThemeText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default FoodSearch;