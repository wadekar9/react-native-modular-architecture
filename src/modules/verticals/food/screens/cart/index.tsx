import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import { IconButton, ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppTranslation } from '@core/i18n';
import { styling } from './styles';
import { FoodStackScreenProps } from '../../types/navigation.types';
import { EFoodStackScreens } from '../../constants/screens.constants';
import { useFoodCart } from '../../hooks';

const FoodCart: React.FC<FoodStackScreenProps<EFoodStackScreens.FOOD_CART>> = () => {
  const { colors, theme } = useAppTheme();
  const { food_t } = useAppTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const {
    cart,
    deliveryFee,
    total,
    goBack,
    browseRecipes,
    removeItem,
    updateItemQuantity,
    checkout,
  } = useFoodCart();

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <IconButton accessibilityRole="button" accessibilityLabel={food_t('BACK')} onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={20} color={colors['text-primary']} />
        </IconButton>
        <View style={styles.headerText}>
          <ThemeText variant="h3">{food_t('YOUR_BASKET')}</ThemeText>
          <ThemeText variant="body5" style={styles.muted}>
            {cart.count === 1 ? food_t('ITEM_COUNT_ONE', { count: cart.count }) : food_t('ITEM_COUNT_OTHER', { count: cart.count })}
          </ThemeText>
        </View>
      </View>

      {cart.items.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}><ShoppingBag size={27} color={colors['brand-primary']} /></View>
          <ThemeText variant="h3">{food_t('BASKET_WAITING')}</ThemeText>
          <ThemeText variant="body5" style={styles.emptyCopy}>{food_t('BASKET_WAITING_COPY')}</ThemeText>
          <Pressable onPress={browseRecipes} style={styles.primaryButton}>
            <ThemeText variant="body4" style={styles.primaryLabel}>{food_t('BROWSE_RECIPES')}</ThemeText>
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
                  <View style={styles.itemPrice}>
                    <ThemeText variant="h4">₹{item.price.toLocaleString('en-IN')}</ThemeText>
                    <ThemeText variant="body5" style={styles.demoLabel}>{food_t('DEMO_RECIPE_TAG')}</ThemeText>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <IconButton
                    accessibilityRole="button"
                    accessibilityLabel={food_t('REMOVE_ITEM_ACCESSIBILITY', { title: item.title })}
                    onPress={() => removeItem(item.id)}
                    style={styles.removeButton}
                  >
                    <Trash2 size={16} color={colors['icon-destructive']} />
                  </IconButton>
                  <View style={styles.quantityControl}>
                    <IconButton
                      accessibilityRole="button"
                      accessibilityLabel={food_t('DECREASE_QTY_ACCESSIBILITY', { title: item.title })}
                      onPress={() => updateItemQuantity(item.id, item.quantity - 1)}
                      style={styles.quantityButton}
                    >
                      <Minus size={14} color={colors['text-primary']} />
                    </IconButton>
                    <ThemeText variant="body4" style={styles.quantity}>{item.quantity}</ThemeText>
                    <IconButton
                      accessibilityRole="button"
                      accessibilityLabel={food_t('INCREASE_QTY_ACCESSIBILITY', { title: item.title })}
                      onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
                      style={styles.quantityButton}
                    >
                      <Plus size={14} color={colors['text-primary']} />
                    </IconButton>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.checkoutPanel}>
            <ThemeText variant="body5" style={styles.demoNote}>{food_t('DEMO_VALUES_NOTE')}</ThemeText>
            <View style={styles.priceRow}>
              <ThemeText variant="body5" style={styles.muted}>{food_t('SUBTOTAL')}</ThemeText>
              <ThemeText variant="body5">₹{cart.total.toLocaleString('en-IN')}</ThemeText>
            </View>
            <View style={styles.priceRow}>
              <ThemeText variant="body5" style={styles.muted}>{food_t('DELIVERY')}</ThemeText>
              <ThemeText variant="body5">{deliveryFee ? `₹${deliveryFee}` : food_t('FREE')}</ThemeText>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <ThemeText variant="h4">{food_t('TOTAL')}</ThemeText>
              <ThemeText variant="h3">₹{total.toLocaleString('en-IN')}</ThemeText>
            </View>
            <Pressable onPress={checkout} style={styles.primaryButton}>
              <ThemeText variant="body4" style={styles.primaryLabel}>{food_t('CONTINUE_TO_PAYMENT')}</ThemeText>
            </Pressable>
          </View>
        </>
      )}
    </ThemedView>
  );
};

export default FoodCart;
