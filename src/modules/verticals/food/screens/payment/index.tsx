import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeft, Check, CreditCard, Smartphone, Wallet } from 'lucide-react-native';
import { BaseTextInput, IconButton, ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { EFoodStackScreens } from '../../constants/screens.constants';
import type { FoodStackScreenProps } from '../../types/navigation.types';
import type { FoodPaymentMethod } from '../../types/order.types';
import { useFoodPayment, useFoodTranslation } from '../../hooks';
import { styling } from './styles';

type PaymentOptionItem = {
  id: FoodPaymentMethod;
  labelKey: 'UPI_LABEL' | 'CARD_LABEL' | 'COD_LABEL';
  detailKey: 'UPI_DETAIL' | 'CARD_DETAIL' | 'COD_DETAIL';
  icon: typeof Smartphone;
};

const PAYMENT_OPTIONS: PaymentOptionItem[] = [
  { id: 'UPI', labelKey: 'UPI_LABEL', detailKey: 'UPI_DETAIL', icon: Smartphone },
  { id: 'Card', labelKey: 'CARD_LABEL', detailKey: 'CARD_DETAIL', icon: CreditCard },
  { id: 'Cash on delivery', labelKey: 'COD_LABEL', detailKey: 'COD_DETAIL', icon: Wallet },
];

const FoodPayment: React.FC<FoodStackScreenProps<EFoodStackScreens.FOOD_PAYMENT>> = () => {
  const { colors, theme } = useAppTheme();
  const { food_t } = useFoodTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const {
    cart,
    customerName,
    phone,
    address,
    paymentMethod,
    error,
    deliveryFee,
    total,
    demoRecipePrice,
    goBack,
    setCustomerName,
    setPhone,
    setAddress,
    setPaymentMethod,
    placeOrder,
  } = useFoodPayment();

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <IconButton accessibilityRole="button" accessibilityLabel={food_t('BACK_TO_BASKET')} onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={20} color={colors['text-primary']} />
        </IconButton>
        <ThemeText variant="h3">{food_t('CHECKOUT')}</ThemeText>
        <View style={styles.headerStep}><ThemeText variant="body5" style={styles.stepText}>{food_t('PAYMENT')}</ThemeText></View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemeText variant="h3">{food_t('DELIVERY_DETAILS')}</ThemeText>
          <BaseTextInput
            label={food_t('FULL_NAME')}
            placeholder={food_t('FULL_NAME_PLACEHOLDER')}
            value={customerName}
            onChangeText={setCustomerName}
            autoComplete="name"
            textContentType="name"
          />
          <BaseTextInput
            label={food_t('PHONE_NUMBER')}
            placeholder={food_t('PHONE_PLACEHOLDER')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            maxLength={15}
          />
          <BaseTextInput
            label={food_t('DELIVERY_ADDRESS')}
            placeholder={food_t('ADDRESS_PLACEHOLDER')}
            value={address}
            onChangeText={setAddress}
            autoComplete="street-address"
            textContentType="fullStreetAddress"
          />
        </View>

        <View style={styles.section}>
          <ThemeText variant="h3">{food_t('PAYMENT_METHOD')}</ThemeText>
          {PAYMENT_OPTIONS.map(option => {
            const Icon = option.icon;
            const selected = paymentMethod === option.id;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setPaymentMethod(option.id)}
                style={[styles.paymentOption, selected && styles.paymentSelected]}
              >
                <View style={[styles.paymentIcon, selected && styles.paymentIconSelected]}>
                  <Icon size={19} color={selected ? colors['brand-primary'] : colors['icon-default']} />
                </View>
                <View style={styles.optionCopy}>
                  <ThemeText variant="body4">{food_t(option.labelKey)}</ThemeText>
                  <ThemeText variant="body5" style={styles.muted}>{food_t(option.detailKey)}</ThemeText>
                </View>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <Check size={13} color="#FFFFFF" /> : null}
                </View>
              </Pressable>
            );
          })}
          <ThemeText variant="body5" style={styles.demoNote}>
            {food_t('DEMO_CHECKOUT_NOTE', { price: demoRecipePrice })}
          </ThemeText>
        </View>

        <View style={styles.summary}>
          <View style={styles.priceRow}>
            <ThemeText variant="body5" style={styles.muted}>{food_t('ITEMS_COUNT_LABEL', { count: cart.count })}</ThemeText>
            <ThemeText variant="body5">₹{cart.total.toLocaleString('en-IN')}</ThemeText>
          </View>
          <View style={styles.priceRow}>
            <ThemeText variant="body5" style={styles.muted}>{food_t('DELIVERY')}</ThemeText>
            <ThemeText variant="body5">{deliveryFee ? `₹${deliveryFee}` : food_t('FREE')}</ThemeText>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <ThemeText variant="h4">{food_t('TOTAL_PAYABLE')}</ThemeText>
            <ThemeText variant="h3">₹{total.toLocaleString('en-IN')}</ThemeText>
          </View>
          {error ? <ThemeText variant="body5" style={styles.error} accessibilityRole="alert">{error}</ThemeText> : null}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <ThemeText variant="body5" style={styles.muted}>{food_t('TOTAL')}</ThemeText>
          <ThemeText variant="h3">₹{total.toLocaleString('en-IN')}</ThemeText>
        </View>
        <Pressable onPress={placeOrder} style={styles.confirmButton}>
          <ThemeText variant="body4" style={styles.confirmText}>{food_t('PLACE_ORDER')}</ThemeText>
        </Pressable>
      </View>
    </ThemedView>
  );
};

export default FoodPayment;