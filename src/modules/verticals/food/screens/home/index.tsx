import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import {
  useCatalogCategories,
  useCatalogProducts,
  type CatalogProduct,
} from '@modules/catalog';
import { useCart } from '@core/store/hooks';
import ProductItem from '../../components/ProductItem';
import { styling } from './styles';
import { FoodBottomBarScreenProps } from '../../types/navigation.types';
import { EFoodBottomScreens } from '../../constants/screens.constants';

const EMPTY_PRODUCTS: CatalogProduct[] = [];
const EMPTY_CATEGORIES: string[] = [];

const FoodHome : React.FC<FoodBottomBarScreenProps<EFoodBottomScreens.FOOD_HOME>> = () => {

  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  
  const { itemCount, total, addProduct } = useCart();
  const productsQuery = useCatalogProducts();
  const categoriesQuery = useCatalogCategories();
  const products = productsQuery.data;
  const categories = categoriesQuery.data ?? EMPTY_CATEGORIES;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const loading = productsQuery.isPending || categoriesQuery.isPending;
  const queryError = productsQuery.error ?? categoriesQuery.error;

  const filteredProducts = useMemo(() => {
    return (products ?? EMPTY_PRODUCTS).filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  const handleAddToCart = (product: CatalogProduct) => {
    addProduct({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      category: product.category,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.cartBanner}>
        <ThemeText variant="h4">Cart</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
          {itemCount} items • ${total}
        </ThemeText>
      </View>

      <View style={styles.header}>
        <ThemeText variant="h3">Fresh picks</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>42 results</ThemeText>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search foods"
        placeholderTextColor={colors['text-muted']}
        style={[styles.searchInput, { borderColor: colors.border, color: colors['text-primary'] }]}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
        <Pressable
          onPress={() => setSelectedCategory('all')}
          style={[styles.chip, selectedCategory === 'all' && { backgroundColor: colors['brand-primary'] }]}
        >
          <Text style={[styles.chipText, selectedCategory === 'all' && { color: colors.surface }]}>All</Text>
        </Pressable>

        {categories.map(category => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.chip,
              selectedCategory === category && { backgroundColor: colors['brand-primary'] },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                selectedCategory === category && { color: colors.surface },
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {queryError ? (
        <View style={styles.emptyState}>
          <ThemeText variant="h4">Unable to load the catalog. Please try again later.</ThemeText>
        </View>
      ) : loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors['brand-primary']} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => `food-${item.id}`}
          renderItem={({ item }) => <ProductItem theme={theme} product={item} handleAddToCart={handleAddToCart} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ThemeText variant="h4">No food matches your search.</ThemeText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
};

export default FoodHome;
