import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowRight, ClipboardList, MapPin, ReceiptText } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { EFoodBottomScreens } from '../../constants/screens.constants';
import type { FoodBottomBarScreenProps } from '../../types/navigation.types';
import { useFoodOrders, useFoodTranslation } from '../../hooks';
import { styling } from './styles';

const MyOrders: React.FC<FoodBottomBarScreenProps<EFoodBottomScreens.MY_ORDERS>> = () => {
  const { colors, theme } = useAppTheme();
  const { food_t, i18n } = useFoodTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const { orders, browseRecipes, openOrder } = useFoodOrders();

  const locale = i18n.language === 'es' ? 'es-ES' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <View>
            <ThemeText variant="body5" style={styles.eyebrow}>{food_t('YOUR_TABLE_YOUR_TIME')}</ThemeText>
            <ThemeText variant="h1" style={styles.title}>{food_t('MY_ORDERS_TITLE')}</ThemeText>
            {orders.length > 0 ? <ThemeText variant="body5" style={styles.demoNote}>{food_t('LOCAL_DEMO_ORDERS')}</ThemeText> : null}
          </View>
          <View style={styles.countBadge}><ThemeText variant="body5" style={styles.countText}>{orders.length}</ThemeText></View>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><ClipboardList size={26} color={colors['brand-primary']} /></View>
            <ThemeText variant="h3">{food_t('NO_ORDERS_YET')}</ThemeText>
            <ThemeText variant="body5" style={styles.emptyCopy}>{food_t('NO_ORDERS_SUBTITLE')}</ThemeText>
            <Pressable onPress={browseRecipes} style={styles.browseButton}>
              <ThemeText variant="body4" style={styles.browseLabel}>{food_t('BROWSE_TODAYS_MENU')}</ThemeText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.orderList}>
            {orders.map(order => {
              const dishLabel = order.items.length === 1
                ? food_t('DISH_COUNT_ONE', { count: order.items.length })
                : food_t('DISH_COUNT_OTHER', { count: order.items.length });

              return (
                <Pressable
                  key={order.id}
                  accessibilityRole="button"
                  accessibilityLabel={food_t('ORDER_ACCESSIBILITY', { id: order.id, status: order.status, total: order.total })}
                  onPress={() => openOrder(order.id)}
                  style={({ pressed }) => [styles.orderCard, pressed && styles.pressed]}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.receiptIcon}><ReceiptText size={18} color={colors['brand-primary']} /></View>
                    <View style={styles.orderHeading}>
                      <ThemeText variant="body4">
                        {dishLabel} · {new Date(order.createdAt).toLocaleDateString(locale)}
                      </ThemeText>
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
              );
            })}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default MyOrders;
