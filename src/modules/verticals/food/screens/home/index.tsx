import React from 'react';
import { ImageBackground, Pressable, ScrollView, View } from 'react-native';
import { ArrowRight, Plus, ShoppingBag, Star } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { addToCart } from '../../store/cart.slice';
import { selectFoodCart } from '../../store/food.selectors';
import { EFoodBottomScreens, EFoodStackScreens } from '../../constants/screens.constants';
import type { FoodBottomBarScreenProps } from '../../types/navigation.types';
import { styling } from './styles';

const MENU_ITEMS = [
  { id: 201, title: 'Miso-glazed salmon bowl', category: 'Balanced · Japanese', price: 420, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80' },
  { id: 202, title: 'Roasted tomato rigatoni', category: 'Vegetarian · Italian', price: 340, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80' },
  { id: 203, title: 'Crispy chicken sandwich', category: 'Bestseller · Comfort', price: 290, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80' },
];

const FoodHome: React.FC<FoodBottomBarScreenProps<EFoodBottomScreens.FOOD_HOME>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectFoodCart);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <ThemeText variant="body5" style={styles.eyebrow}>GOOD FOOD, DELIVERED</ThemeText>
            <ThemeText variant="h1" style={styles.title}>A little delicious.</ThemeText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Basket, ${cart.count} items`}
            onPress={() => navigation.navigate(EFoodStackScreens.FOOD_CART)}
            style={styles.cartButton}
          >
            <ShoppingBag size={20} color={colors['text-primary']} />
            {cart.count > 0 ? <View style={styles.cartBadge}><ThemeText variant="body5" style={styles.badgeText}>{cart.count}</ThemeText></View> : null}
          </Pressable>
        </View>

        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85' }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroShade} />
          <View style={styles.heroContent}>
            <View style={styles.rating}><Star size={13} color="#F8D28A" fill="#F8D28A" /><ThemeText variant="body5" style={styles.ratingText}>4.9 · Kitchen pick</ThemeText></View>
            <ThemeText variant="h2" style={styles.heroTitle}>Made fresh.
Made for you.</ThemeText>
            <Pressable onPress={() => navigation.navigate(EFoodBottomScreens.MY_ORDERS)} style={styles.heroLink}>
              <ThemeText variant="body5" style={styles.heroLinkText}>Your orders</ThemeText>
              <ArrowRight size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.sectionHeading}>
          <View>
            <ThemeText variant="h3">Today’s menu</ThemeText>
            <ThemeText variant="body5" style={styles.secondary}>A few favorites from our kitchen</ThemeText>
          </View>
          <ThemeText variant="body5" style={styles.menuCount}>03 DISHES</ThemeText>
        </View>

        {MENU_ITEMS.map(item => {
          const quantity = cart.items.find(cartItem => cartItem.id === item.id)?.quantity ?? 0;
          return (
            <View key={item.id} style={styles.menuCard}>
              <ImageBackground source={{ uri: item.image }} style={styles.menuImage} imageStyle={styles.menuImageRadius} />
              <View style={styles.menuDetails}>
                <ThemeText variant="body4" numberOfLines={2}>{item.title}</ThemeText>
                <ThemeText variant="body5" style={styles.secondary}>{item.category}</ThemeText>
                <View style={styles.menuFooter}>
                  <ThemeText variant="h4">₹{item.price}</ThemeText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${item.title} to basket`}
                    onPress={() => dispatch(addToCart(item))}
                    style={styles.addButton}
                  >
                    <Plus size={15} color={colors['brand-primary']} />
                    <ThemeText variant="body5" style={styles.addLabel}>{quantity ? `Add more · ${quantity}` : 'Add'}</ThemeText>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
};

export default FoodHome