import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import {
  fetchDummyJsonProducts,
  type DummyJsonProduct,
} from '@core/networking/dummyjson.api';
import { useAppDispatch, useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';
import { addToCart } from '@core/store/slices';

const InstamartHomeScreen = () => {
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart);
  const [products, setProducts] = useState<DummyJsonProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const catalog = await fetchDummyJsonProducts();
        setProducts(catalog);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

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
    <View style={styles.itemCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.itemMeta}>
        <ThemeText variant="h4">{item.title}</ThemeText>
        <Text style={{ color: colors['text-muted'] }}>{item.category}</Text>
        <View style={styles.row}>
          <ThemeText variant="h4">${item.price}</ThemeText>
          <Pressable
            onPress={() => handleAddToCart(item)}
            style={[styles.addButton, { backgroundColor: colors['brand-primary'] }]}
          >
            <Text style={[styles.addText, { color: colors.surface }]}>Add</Text>
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

      <View style={styles.hero}>
        <View>
          <ThemeText variant="h3">Instashop</ThemeText>
          <Text style={{ color: colors['text-muted'], marginTop: 6 }}>Fresh groceries delivered in 20 mins</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors['brand-primary'] }]}>
          <Text style={[styles.badgeText, { color: colors.surface }]}>Live</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <ThemeText variant="h4">$142</ThemeText>
          <Text style={{ color: colors['text-muted'] }}>Today</Text>
        </View>
        <View style={styles.summaryBox}>
          <ThemeText variant="h4">18</ThemeText>
          <Text style={{ color: colors['text-muted'] }}>Stores</Text>
        </View>
        <View style={styles.summaryBox}>
          <ThemeText variant="h4">4.9</ThemeText>
          <Text style={{ color: colors['text-muted'] }}>Rating</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Featured deals</Text>
      <FlatList
        data={featuredProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => `deal-${item.id}`}
        renderItem={({ item }) => (
          <View style={[styles.dealCard, { backgroundColor: colors.surface }]}>
            <Image source={{ uri: item.thumbnail }} style={styles.dealImage} />
            <ThemeText variant="h4">{item.title}</ThemeText>
            <Text style={{ color: colors['text-muted'] }}>{item.category}</Text>
          </View>
        )}
        contentContainerStyle={styles.dealList}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors['brand-primary']} />
        </View>
      ) : (
        <FlatList
          data={products.slice(0, 8)}
          keyExtractor={item => `grocery-${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    gap: 18,
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
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  dealList: {
    gap: 10,
    paddingRight: 10,
  },
  dealCard: {
    width: 160,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  dealImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: {
    width: 110,
    height: 110,
    backgroundColor: '#F3F4F6',
  },
  itemMeta: {
    flex: 1,
    padding: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addText: {
    fontWeight: '700',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default InstamartHomeScreen;