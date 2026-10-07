import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeft, Check, Clock3, MapPin, PackageCheck, Phone, ReceiptText } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppSelector } from '@core/store/hooks';
import { selectFoodOrders } from '../../store/food.selectors';
import { EFoodStackScreens } from '../../constants/screens.constants';
import type { FoodStackScreenProps } from '../../types/navigation.types';
import { styling } from './styles';

const OrderDetails: React.FC<FoodStackScreenProps<EFoodStackScreens.ORDER_DETAILS>> = ({ navigation, route }) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const order = useAppSelector(selectFoodOrders).orders.find(item => item.id === route.params.orderId);

  if (!order) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemeText variant="h3">We couldn’t find that order.</ThemeText>
        <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
          <ThemeText variant="body4" style={styles.linkText}>Go back</ThemeText>
        </Pressable>
      </ThemedView>
    );
  }

  const steps = ['Confirmed', 'Preparing', 'On the way', 'Delivered'] as const;
  const activeIndex = steps.indexOf(order.status);
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={20} color={colors['text-primary']} />
        </Pressable>
        <View style={styles.headerCopy}>
          <ThemeText variant="h3">Order details</ThemeText>
          <ThemeText variant="body5" style={styles.muted}>{order.id}</ThemeText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeading}>
            <View style={styles.statusIcon}><PackageCheck size={21} color={colors['brand-primary']} /></View>
            <View style={styles.statusCopy}>
              <ThemeText variant="h4">{order.status}</ThemeText>
              <ThemeText variant="body5" style={styles.muted}>Order placed {new Date(order.createdAt).toLocaleDateString('en-IN')} · {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</ThemeText>
            </View>
          </View>
          <View style={styles.timeline}>
            {steps.map((step, index) => {
              const complete = index <= activeIndex;
              return (
                <View key={step} style={styles.timelineStep}>
                  <View style={[styles.timelineMark, complete && styles.timelineMarkComplete]}>
                    {complete ? <Check size={12} color="#FFFFFF" /> : null}
                  </View>
                  <ThemeText variant="body5" style={[styles.timelineLabel, complete && styles.timelineLabelComplete]}>{step}</ThemeText>
                  {index < steps.length - 1 ? <View style={[styles.timelineLine, index < activeIndex && styles.timelineLineComplete]} /> : null}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemeText variant="h3">Items · {itemCount}</ThemeText>
          {order.items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemQuantity}><ThemeText variant="body5" style={styles.quantityText}>{item.quantity}×</ThemeText></View>
              <ThemeText variant="body5" style={styles.itemName}>{item.title}</ThemeText>
              <ThemeText variant="body4">₹{(item.price * item.quantity).toLocaleString('en-IN')}</ThemeText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemeText variant="h3">Delivery</ThemeText>
          <View style={styles.infoCard}>
            <View style={styles.detailRow}><MapPin size={17} color={colors['icon-muted']} /><ThemeText variant="body5" style={styles.detailText}>{order.address}</ThemeText></View>
            <View style={styles.detailRow}><Phone size={17} color={colors['icon-muted']} /><ThemeText variant="body5" style={styles.detailText}>{order.customerName} · {order.phone}</ThemeText></View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemeText variant="h3">Payment summary</ThemeText>
          <View style={styles.infoCard}>
            <View style={styles.priceRow}><ThemeText variant="body5" style={styles.muted}>Items subtotal</ThemeText><ThemeText variant="body5">₹{order.subtotal.toLocaleString('en-IN')}</ThemeText></View>
            <View style={styles.priceRow}><ThemeText variant="body5" style={styles.muted}>Delivery</ThemeText><ThemeText variant="body5">{order.deliveryFee ? `₹${order.deliveryFee}` : 'Free'}</ThemeText></View>
            <View style={[styles.priceRow, styles.totalRow]}><View style={styles.paymentLabel}><ReceiptText size={15} color={colors['icon-muted']} /><ThemeText variant="body5" style={styles.muted}>{order.paymentMethod}</ThemeText></View><ThemeText variant="h4">₹{order.total.toLocaleString('en-IN')}</ThemeText></View>
            <View style={styles.demoNote}><Clock3 size={14} color={colors['icon-muted']} /><ThemeText variant="body5" style={styles.muted}>Demo order · payment not processed</ThemeText></View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default OrderDetails;