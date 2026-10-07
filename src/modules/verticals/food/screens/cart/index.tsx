import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { styling } from './styles';
import { FoodStackScreenProps } from '../../types/navigation.types';
import { EFoodStackScreens } from '../../constants/screens.constants';
import { removeFromCart, updateQuantity } from '../../store/cart.slice';
import { selectFoodCart } from '../../store/food.selectors';

const FoodCart: React.FC<FoodStackScreenProps<EFoodStackScreens.FOOD_CART>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectFoodCart);
  const deliveryFee = cart.total >= 500 || cart.total === 0 ? 0 : 40;

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={20} color={colors['text-primary']} />
        </Pressable>
        <View style={styles.headerText}>
          <ThemeText variant="h3">Your basket</ThemeText>
          <ThemeText variant="body5" style={styles.muted}>{cart.count} {cart.count === 1 ? 'item' : 'items'}</ThemeText>
        </View>
      </View>

      {cart.items.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}><ShoppingBag size={27} color={colors['brand-primary']} /></View>
          <ThemeText variant="h3">Your basket is waiting</ThemeText>
          <ThemeText variant="body5" style={styles.emptyCopy}>Add something delicious and it will show up here.</ThemeText>
          <Pressable onPress={() => navigation.navigate(EFoodStackScreens.FOOD_BOTTOM_TAB)} style={styles.primaryButton}>
            <ThemeText variant="body4" style={styles.primaryLabel}>Browse food</ThemeText>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {cart.items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <ThemeText variant="body4" numberOfLines={2}>{item.title}</ThemeText>
                  <ThemeText variant="body5" style={styles.muted}>{item.category}</ThemeText>
                  <ThemeText variant="h4">₹{item.price.toLocaleString('en-IN')}</ThemeText>
                </View>
                <View style={styles.itemActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${item.title}`}
                    onPress={() => dispatch(removeFromCart(item.id))}
                    style={styles.removeButton}
                  >
                    <Trash2 size={16} color={colors['icon-destructive']} />
                  </Pressable>
                  <View style={styles.quantityControl}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Decrease ${item.title} quantity`}
                      onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      style={styles.quantityButton}
                    >
                      <Minus size={14} color={colors['text-primary']} />
                    </Pressable>
                    <ThemeText variant="body4" style={styles.quantity}>{item.quantity}</ThemeText>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Increase ${item.title} quantity`}
                      onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      style={styles.quantityButton}
                    >
                      <Plus size={14} color={colors['text-primary']} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.checkoutPanel}>
            <View style={styles.priceRow}>
              <ThemeText variant="body5" style={styles.muted}>Subtotal</ThemeText>
              <ThemeText variant="body5">₹{cart.total.toLocaleString('en-IN')}</ThemeText>
            </View>
            <View style={styles.priceRow}>
              <ThemeText variant="body5" style={styles.muted}>Delivery</ThemeText>
              <ThemeText variant="body5">{deliveryFee ? `₹${deliveryFee}` : 'Free'}</ThemeText>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <ThemeText variant="h4">Total</ThemeText>
              <ThemeText variant="h3">₹{(cart.total + deliveryFee).toLocaleString('en-IN')}</ThemeText>
            </View>
            <Pressable onPress={() => navigation.navigate(EFoodStackScreens.FOOD_PAYMENT)} style={styles.primaryButton}>
              <ThemeText variant="body4" style={styles.primaryLabel}>Continue to payment</ThemeText>
            </Pressable>
          </View>
        </>
      )}
    </ThemedView>
  );
};

export default FoodCart
