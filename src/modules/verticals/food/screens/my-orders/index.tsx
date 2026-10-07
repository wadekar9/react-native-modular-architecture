import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowRight, ClipboardList, MapPin, ReceiptText } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppSelector } from '@core/store/hooks';
import { selectFoodOrders } from '../../store/food.selectors';
import { EFoodBottomScreens, EFoodStackScreens } from '../../constants/screens.constants';
import type { FoodBottomBarScreenProps } from '../../types/navigation.types';
import { styling } from './styles';

const MyOrders: React.FC<FoodBottomBarScreenProps<EFoodBottomScreens.MY_ORDERS>> = ({ navigation }) => {

  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const orders = useAppSelector(selectFoodOrders).orders;

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <View>
            <ThemeText variant="body5" style={styles.eyebrow}>YOUR TABLE, YOUR TIME</ThemeText>
            <ThemeText variant="h1" style={styles.title}>My orders</ThemeText>
          </View>
          <View style={styles.countBadge}><ThemeText variant="body5" style={styles.countText}>{orders.length}</ThemeText></View>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><ClipboardList size={26} color={colors['brand-primary']} /></View>
            <ThemeText variant="h3">No orders yet</ThemeText>
            <ThemeText variant="body5" style={styles.emptyCopy}>Your next favorite meal is a few taps away.</ThemeText>
            <Pressable onPress={() => navigation.navigate(EFoodBottomScreens.FOOD_HOME)} style={styles.browseButton}>
              <ThemeText variant="body4" style={styles.browseLabel}>Browse today’s menu</ThemeText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.orderList}>
            {orders.map(order => (
              <Pressable
                key={order.id}
                accessibilityRole="button"
                accessibilityLabel={`Order ${order.id}, ${order.status}, ₹${order.total}`}
                onPress={() => navigation.navigate(EFoodStackScreens.ORDER_DETAILS, { orderId: order.id })}
                style={({ pressed }) => [styles.orderCard, pressed && styles.pressed]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.receiptIcon}><ReceiptText size={18} color={colors['brand-primary']} /></View>
                  <View style={styles.orderHeading}>
                    <ThemeText variant="body4">{order.items.length} {order.items.length === 1 ? 'dish' : 'dishes'} · {new Date(order.createdAt).toLocaleDateString('en-IN')}</ThemeText>
                    <ThemeText variant="body5" style={styles.secondary}>{order.id}</ThemeText>
                  </View>
                  <ArrowRight size={18} color={colors['icon-muted']} />
                </View>
                <View style={styles.cardDivider} />
                <View style={styles.cardBottom}>
                  <View style={styles.statusWrap}><View style={styles.statusDot} /><ThemeText variant="body5" style={styles.statusText}>{order.status}</ThemeText></View>
                  <ThemeText variant="h4">₹{order.total.toLocaleString('en-IN')}</ThemeText>
                </View>
                <View style={styles.addressRow}>
                  <MapPin size={14} color={colors['icon-muted']} />
                  <ThemeText variant="body5" numberOfLines={1} style={styles.secondary}>{order.address}</ThemeText>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default MyOrders
