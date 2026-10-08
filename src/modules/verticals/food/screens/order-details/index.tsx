import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeft, Check, Clock3, MapPin, PackageCheck, Phone, ReceiptText } from 'lucide-react-native';
import { IconButton, ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppTranslation } from '@core/i18n';
import { EFoodStackScreens } from '../../constants/screens.constants';
import type { FoodStackScreenProps } from '../../types/navigation.types';
import { useOrderDetails } from '../../hooks';
import { styling } from './styles';

const OrderDetails: React.FC<FoodStackScreenProps<EFoodStackScreens.ORDER_DETAILS>> = ({ route }) => {
  const { colors, theme } = useAppTheme();
  const { food_t, i18n } = useAppTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const { order, itemCount, statusSteps, goBack } = useOrderDetails(route.params.orderId);

  const locale = i18n.language === 'es' ? 'es-ES' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';

  if (!order) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemeText variant="h3">{food_t('ORDER_NOT_FOUND')}</ThemeText>
        <Pressable onPress={goBack} style={styles.backLink}>
          <ThemeText variant="body4" style={styles.linkText}>{food_t('GO_BACK')}</ThemeText>
        </Pressable>
      </ThemedView>
    );
  }

  const activeIndex = statusSteps.indexOf(order.status);
  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <IconButton accessibilityRole="button" accessibilityLabel={food_t('BACK')} onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={20} color={colors['text-primary']} />
        </IconButton>
        <View style={styles.headerCopy}>
          <ThemeText variant="h3">{food_t('ORDER_DETAILS_TITLE')}</ThemeText>
          <ThemeText variant="body5" style={styles.muted}>{order.id}</ThemeText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeading}>
            <View style={styles.statusIcon}><PackageCheck size={21} color={colors['brand-primary']} /></View>
            <View style={styles.statusCopy}>
              <ThemeText variant="h4">{order.status}</ThemeText>
              <ThemeText variant="body5" style={styles.muted}>
                {food_t('ORDER_PLACED_AT', {
                  date: new Date(order.createdAt).toLocaleDateString(locale),
                  time: new Date(order.createdAt).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' }),
                })}
              </ThemeText>
            </View>
          </View>
          <View style={styles.timeline}>
            {statusSteps.map((step, index) => {
              const complete = index <= activeIndex;
              return (
                <View key={step} style={styles.timelineStep}>
                  <View style={[styles.timelineMark, complete && styles.timelineMarkComplete]}>
                    {complete ? <Check size={12} color="#FFFFFF" /> : null}
                  </View>
                  <ThemeText variant="body5" style={[styles.timelineLabel, complete && styles.timelineLabelComplete]}>{step}</ThemeText>
                  {index < statusSteps.length - 1 ? <View style={[styles.timelineLine, index < activeIndex && styles.timelineLineComplete]} /> : null}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemeText variant="h3">
            {itemCount === 1 ? food_t('ITEM_COUNT_ONE', { count: itemCount }) : food_t('ITEM_COUNT_OTHER', { count: itemCount })}
          </ThemeText>
          {order.items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemQuantity}><ThemeText variant="body5" style={styles.quantityText}>{item.quantity}×</ThemeText></View>
              <ThemeText variant="body5" style={styles.itemName}>{item.title}</ThemeText>
              <ThemeText variant="body4">₹{(item.price * item.quantity).toLocaleString('en-IN')}</ThemeText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemeText variant="h3">{food_t('DELIVERY')}</ThemeText>
          <View style={styles.infoCard}>
            <View style={styles.detailRow}><MapPin size={17} color={colors['icon-muted']} /><ThemeText variant="body5" style={styles.detailText}>{order.address}</ThemeText></View>
            <View style={styles.detailRow}><Phone size={17} color={colors['icon-muted']} /><ThemeText variant="body5" style={styles.detailText}>{order.customerName} · {order.phone}</ThemeText></View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemeText variant="h3">{food_t('PAYMENT_SUMMARY')}</ThemeText>
          <View style={styles.infoCard}>
            <View style={styles.priceRow}><ThemeText variant="body5" style={styles.muted}>{food_t('ITEMS_SUBTOTAL')}</ThemeText><ThemeText variant="body5">₹{order.subtotal.toLocaleString('en-IN')}</ThemeText></View>
            <View style={styles.priceRow}><ThemeText variant="body5" style={styles.muted}>{food_t('DELIVERY')}</ThemeText><ThemeText variant="body5">{order.deliveryFee ? `₹${order.deliveryFee}` : food_t('FREE')}</ThemeText></View>
            <View style={[styles.priceRow, styles.totalRow]}><View style={styles.paymentLabel}><ReceiptText size={15} color={colors['icon-muted']} /><ThemeText variant="body5" style={styles.muted}>{order.paymentMethod}</ThemeText></View><ThemeText variant="h4">₹{order.total.toLocaleString('en-IN')}</ThemeText></View>
            <View style={styles.demoNote}><Clock3 size={14} color={colors['icon-muted']} /><ThemeText variant="body5" style={styles.muted}>{food_t('DEMO_ORDER_DISCLAIMER')}</ThemeText></View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default OrderDetails;