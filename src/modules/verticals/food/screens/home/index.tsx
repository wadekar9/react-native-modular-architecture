import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import {
  fetchDummyJsonCategories,
  fetchDummyJsonProducts,
  type DummyJsonProduct,
} from '@core/networking/dummyjson.api';
import { useAppDispatch, useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';
import { addToCart } from '@core/store/slices';

const FoodHomeScreen = () => {
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart);
  const [products, setProducts] = useState<DummyJsonProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catalog, availableCategories] = await Promise.all([
          fetchDummyJsonProducts(),
          fetchDummyJsonCategories(),
        ]);
        setProducts(catalog);
        setCategories(availableCategories);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  const handleAddToCart = (product: DummyJsonProduct) => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.thumbnail,
        category: product.category,
      }),
    );
  };

  const renderItem = ({ item }: { item: DummyJsonProduct }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.productDetails}>
        <Text style={[styles.badge, { color: colors['brand-primary'] }]}>{item.category}</Text>
        <ThemeText variant="h4" style={styles.productTitle}>{item.title}</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
          {item.brand} • {item.rating}★
        </ThemeText>
        <View style={styles.metaRow}>
          <ThemeText variant="h4">${item.price}</ThemeText>
          <Pressable
            onPress={() => handleAddToCart(item)}
            style={[styles.cta, { backgroundColor: colors['brand-primary'] }]}
          >
            <Text style={[styles.ctaText, { color: colors.surface }]}>Add</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.cartBanner}>
        <ThemeText variant="h4">Cart</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
          {cart.count} items • ${cart.total}
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

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors['brand-primary']} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => `food-${item.id}`}
          renderItem={renderItem}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    gap: 16,
  },
  cartBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  categoriesRow: {
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  thumbnail: {
    width: 120,
    height: 120,
    backgroundColor: '#F3F4F6',
  },
  productDetails: {
    flex: 1,
    padding: 12,
    gap: 8,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  productTitle: {
    marginTop: -2,
    fontSize: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cta: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ctaText: {
    fontWeight: '700',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 18,
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FoodHomeScreen;