import React from 'react';
import { Pressable, View } from 'react-native';
import { ArrowRight, Check, Clock3, MapPin, ReceiptText } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppSelector } from '@core/store/hooks';
import { selectFoodOrders } from '../../store/food.selectors';
import { EFoodBottomScreens, EFoodStackScreens } from '../../constants/screens.constants';
import type { FoodStackScreenProps } from '../../types/navigation.types';
import { styling } from './styles';

const OrderConfirmation: React.FC<FoodStackScreenProps<EFoodStackScreens.ORDER_CONFIRMATION>> = ({ navigation, route }) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const order = useAppSelector(selectFoodOrders).orders.find(item => item.id === route.params.orderId);

  if (!order) {
    return (
      <ThemedView style={styles.container}>
        <ThemeText variant="h3">Order details are unavailable.</ThemeText>
        <Pressable onPress={() => navigation.navigate(EFoodStackScreens.FOOD_BOTTOM_TAB)} style={styles.primaryButton}>
          <ThemeText variant="body4" style={styles.primaryLabel}>Back to food</ThemeText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successMark}><Check size={32} color={colors['state-success']} strokeWidth={2.5} /></View>
        <ThemeText variant="body5" style={styles.eyebrow}>ORDER PLACED</ThemeText>
        <ThemeText variant="h1" style={styles.title}>Dinner is on its way.</ThemeText>
        <ThemeText variant="body5" style={styles.subtitle}>We’ve saved your order. This demo does not process payment or contact a restaurant.</ThemeText>

        <View style={styles.orderCard}>
          <View style={styles.referenceRow}>
            <View style={styles.receiptIcon}><ReceiptText size={19} color={colors['brand-primary']} /></View>
            <View style={styles.referenceCopy}>
              <ThemeText variant="body5" style={styles.muted}>ORDER REFERENCE</ThemeText>
              <ThemeText variant="h4">{order.id}</ThemeText>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Clock3 size={17} color={colors['icon-muted']} />
            <ThemeText variant="body5" style={styles.infoText}>Placed {new Date(order.createdAt).toLocaleDateString('en-IN')} · {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</ThemeText>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={17} color={colors['icon-muted']} />
            <ThemeText variant="body5" style={styles.infoText} numberOfLines={2}>{order.address}</ThemeText>
          </View>
          <View style={styles.totalRow}>
            <ThemeText variant="body5" style={styles.muted}>{order.items.reduce((count, item) => count + item.quantity, 0)} items · {order.paymentMethod}</ThemeText>
            <ThemeText variant="h4">₹{order.total.toLocaleString('en-IN')}</ThemeText>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate(EFoodStackScreens.ORDER_DETAILS, { orderId: order.id })}
          style={styles.detailsButton}
        >
          <ThemeText variant="body4" style={styles.detailsLabel}>View order details</ThemeText>
          <ArrowRight size={18} color={colors['brand-primary']} />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate(EFoodStackScreens.FOOD_BOTTOM_TAB, { screen: EFoodBottomScreens.MY_ORDERS })}
        style={styles.primaryButton}
      >
        <ThemeText variant="body4" style={styles.primaryLabel}>Go to my orders</ThemeText>
      </Pressable>
    </ThemedView>
  );
};

export default OrderConfirmation;