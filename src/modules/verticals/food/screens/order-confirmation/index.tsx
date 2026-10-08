import React from 'react';
import { Pressable, View } from 'react-native';
import { ArrowRight, Check, Clock3, MapPin, ReceiptText } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppTranslation } from '@core/i18n';
import { EFoodStackScreens } from '../../constants/screens.constants';
import type { FoodStackScreenProps } from '../../types/navigation.types';
import { useOrderConfirmation } from '../../hooks';
import { styling } from './styles';

const OrderConfirmation: React.FC<FoodStackScreenProps<EFoodStackScreens.ORDER_CONFIRMATION>> = ({ route }) => {
  const { colors, theme } = useAppTheme();
  const { food_t, i18n } = useAppTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const { order, backToFood, openOrderDetails, openOrders } = useOrderConfirmation(route.params.orderId);

  const locale = i18n.language === 'es' ? 'es-ES' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';

  if (!order) {
    return (
      <ThemedView style={styles.container}>
        <ThemeText variant="h3">{food_t('ORDER_DETAILS_UNAVAILABLE')}</ThemeText>
        <Pressable onPress={backToFood} style={styles.primaryButton}>
          <ThemeText variant="body4" style={styles.primaryLabel}>{food_t('BACK_TO_FOOD')}</ThemeText>
        </Pressable>
      </ThemedView>
    );
  }

  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successMark}>
          <Check size={32} color={colors['state-success']} strokeWidth={2.5} />
        </View>
        <ThemeText variant="body5" style={styles.eyebrow}>{food_t('ORDER_PLACED')}</ThemeText>
        <ThemeText variant="h1" style={styles.title}>{food_t('DINNER_ON_THE_WAY')}</ThemeText>
        <ThemeText variant="body5" style={styles.subtitle}>{food_t('ORDER_PLACED_SUBTITLE')}</ThemeText>

        <View style={styles.orderCard}>
          <View style={styles.referenceRow}>
            <View style={styles.receiptIcon}><ReceiptText size={19} color={colors['brand-primary']} /></View>
            <View style={styles.referenceCopy}>
              <ThemeText variant="body5" style={styles.muted}>{food_t('ORDER_REFERENCE')}</ThemeText>
              <ThemeText variant="h4">{order.id}</ThemeText>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Clock3 size={17} color={colors['icon-muted']} />
            <ThemeText variant="body5" style={styles.infoText}>
              {food_t('PLACED_DATE_TIME', {
                date: new Date(order.createdAt).toLocaleDateString(locale),
                time: new Date(order.createdAt).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' }),
              })}
            </ThemeText>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={17} color={colors['icon-muted']} />
            <ThemeText variant="body5" style={styles.infoText} numberOfLines={2}>{order.address}</ThemeText>
          </View>
          <View style={styles.totalRow}>
            <ThemeText variant="body5" style={styles.muted}>
              {itemCount === 1 ? food_t('ITEM_COUNT_ONE', { count: itemCount }) : food_t('ITEM_COUNT_OTHER', { count: itemCount })} · {order.paymentMethod}
            </ThemeText>
            <ThemeText variant="h4">₹{order.total.toLocaleString('en-IN')}</ThemeText>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={openOrderDetails}
          style={styles.detailsButton}
        >
          <ThemeText variant="body4" style={styles.detailsLabel}>{food_t('VIEW_ORDER_DETAILS')}</ThemeText>
          <ArrowRight size={18} color={colors['brand-primary']} />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={openOrders}
        style={styles.primaryButton}
      >
        <ThemeText variant="body4" style={styles.primaryLabel}>{food_t('GO_TO_MY_ORDERS')}</ThemeText>
      </Pressable>
    </ThemedView>
  );
};

export default OrderConfirmation;