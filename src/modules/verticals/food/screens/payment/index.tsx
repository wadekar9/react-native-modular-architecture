import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeft, Check, CreditCard, Smartphone, Wallet } from 'lucide-react-native';
import { BaseTextInput, ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { addFoodOrder } from '../../store/orders.slice';
import { clearCart } from '../../store/cart.slice';
import { selectFoodCart } from '../../store/food.selectors';
import type { FoodPaymentMethod } from '../../types/order.types';
import { EFoodStackScreens } from '../../constants/screens.constants';
import type { FoodStackScreenProps } from '../../types/navigation.types';
import { styling } from './styles';

const PAYMENT_OPTIONS: { id: FoodPaymentMethod; label: string; detail: string; icon: typeof Smartphone }[] = [
    { id: 'UPI', label: 'UPI', detail: 'Pay using a UPI app', icon: Smartphone },
    { id: 'Card', label: 'Credit or debit card', detail: 'Demo selection only', icon: CreditCard },
    { id: 'Cash on delivery', label: 'Cash on delivery', detail: 'Pay when your order arrives', icon: Wallet },
];

const FoodPayment: React.FC<FoodStackScreenProps<EFoodStackScreens.FOOD_PAYMENT>> = ({ navigation }) => {
    const { colors, theme } = useAppTheme();
    const styles = React.useMemo(() => styling(theme), [theme]);
    const dispatch = useAppDispatch();
    const cart = useAppSelector(selectFoodCart);
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<FoodPaymentMethod>('UPI');
    const [error, setError] = useState('');
    const deliveryFee = cart.total >= 500 ? 0 : 40;
    const total = cart.total + deliveryFee;

    const placeOrder = () => {
        const cleanName = customerName.trim();
        const cleanPhone = phone.replace(/\D/g, '');
        const cleanAddress = address.trim();
        if (cart.items.length === 0) {
            setError('Add items to your basket before placing an order.');
            return;
        }
        if (cleanName.length < 2) {
            setError('Enter the name for this delivery.');
            return;
        }
        if (cleanPhone.length < 10) {
            setError('Enter a valid phone number.');
            return;
        }
        if (cleanAddress.length < 8) {
            setError('Enter a complete delivery address.');
            return;
        }

        const orderId = `FOOD-${Date.now().toString(36).toUpperCase()}`;
        dispatch(addFoodOrder({
            id: orderId,
            createdAt: new Date().toISOString(),
            items: cart.items.map(item => ({ ...item })),
            subtotal: cart.total,
            deliveryFee,
            total,
            paymentMethod,
            status: 'Confirmed',
            customerName: cleanName,
            phone: cleanPhone,
            address: cleanAddress,
        }));
        dispatch(clearCart());
        navigation.navigate(EFoodStackScreens.ORDER_CONFIRMATION, { orderId });
    };

    return (
        <ThemedView style={styles.screen}>
            <View style={styles.header}>
                <Pressable accessibilityRole="button" accessibilityLabel="Back to basket" onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={20} color={colors['text-primary']} />
                </Pressable>
                <ThemeText variant="h3">Checkout</ThemeText>
                <View style={styles.headerStep}><ThemeText variant="body5" style={styles.stepText}>PAYMENT</ThemeText></View>
            </View>

            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <ThemeText variant="h3">Delivery details</ThemeText>
                    <BaseTextInput
                        label="Full name"
                        placeholder="Name for the order"
                        value={customerName}
                        onChangeText={value => { setCustomerName(value); setError(''); }}
                        autoComplete="name"
                        textContentType="name"
                    />
                    <BaseTextInput
                        label="Phone number"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChangeText={value => { setPhone(value); setError(''); }}
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        textContentType="telephoneNumber"
                        maxLength={15}
                    />
                    <BaseTextInput
                        label="Delivery address"
                        placeholder="House, street, area and landmark"
                        value={address}
                        onChangeText={value => { setAddress(value); setError(''); }}
                        autoComplete="street-address"
                        textContentType="fullStreetAddress"
                    />
                </View>

                <View style={styles.section}>
                    <ThemeText variant="h3">Payment method</ThemeText>
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
                                    <ThemeText variant="body4">{option.label}</ThemeText>
                                    <ThemeText variant="body5" style={styles.muted}>{option.detail}</ThemeText>
                                </View>
                                <View style={[styles.radio, selected && styles.radioSelected]}>
                                    {selected ? <Check size={13} color="#FFFFFF" /> : null}
                                </View>
                            </Pressable>
                        );
                    })}
                    <ThemeText variant="body5" style={styles.demoNote}>Demo checkout only. No payment will be collected or card details stored.</ThemeText>
                </View>

                <View style={styles.summary}>
                    <View style={styles.priceRow}>
                        <ThemeText variant="body5" style={styles.muted}>Items ({cart.count})</ThemeText>
                        <ThemeText variant="body5">₹{cart.total.toLocaleString('en-IN')}</ThemeText>
                    </View>
                    <View style={styles.priceRow}>
                        <ThemeText variant="body5" style={styles.muted}>Delivery</ThemeText>
                        <ThemeText variant="body5">{deliveryFee ? `₹${deliveryFee}` : 'Free'}</ThemeText>
                    </View>
                    <View style={[styles.priceRow, styles.totalRow]}>
                        <ThemeText variant="h4">Total payable</ThemeText>
                        <ThemeText variant="h3">₹{total.toLocaleString('en-IN')}</ThemeText>
                    </View>
                    {error ? <ThemeText variant="body5" style={styles.error} accessibilityRole="alert">{error}</ThemeText> : null}
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <View>
                    <ThemeText variant="body5" style={styles.muted}>TOTAL</ThemeText>
                    <ThemeText variant="h3">₹{total.toLocaleString('en-IN')}</ThemeText>
                </View>
                <Pressable onPress={placeOrder} style={styles.confirmButton}>
                    <ThemeText variant="body4" style={styles.confirmText}>Place order</ThemeText>
                </Pressable>
            </View>
        </ThemedView>
    );
};

export default FoodPayment;