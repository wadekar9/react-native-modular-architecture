import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeft, Check, Minus, Plus, Ticket } from 'lucide-react-native';
import { BaseTextInput, IconButton, ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { getDiningEvent } from '../../services/events.data';
import { EDiningStackScreens } from '../../constants/screens.constants';
import type { DiningStackScreenProps } from '../../types/navigation.types';
import { useDiningTranslation } from '../../hooks';
import { styling } from './styles';

const EventBooking: React.FC<DiningStackScreenProps<EDiningStackScreens.EVENT_BOOKING>> = ({ navigation, route }) => {
  const { colors, theme } = useAppTheme();
  const { dining_t } = useDiningTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const event = getDiningEvent(route.params.eventId);
  const [ticketCount, setTicketCount] = useState(1);
  const [session, setSession] = useState(event?.sessions[0] ?? '');
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [error, setError] = useState('');

  if (!event) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemeText variant="h3">{dining_t('EVENT_UNAVAILABLE')}</ThemeText>
        <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
          <ThemeText variant="body4" style={styles.linkText}>{dining_t('GO_BACK')}</ThemeText>
        </Pressable>
      </ThemedView>
    );
  }

  const submitBooking = () => {
    const cleanName = attendeeName.trim();
    const cleanEmail = attendeeEmail.trim().toLowerCase();
    if (cleanName.length < 2) {
      setError(dining_t('ERROR_NAME'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError(dining_t('ERROR_EMAIL'));
      return;
    }

    setError('');
    navigation.navigate(EDiningStackScreens.BOOKING_CONFIRMATION, {
      eventId: event.id,
      bookingReference: `TABLE-${Date.now().toString(36).toUpperCase()}`,
      ticketCount,
      attendeeEmail: cleanEmail,
      session,
    });
  };

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.topBar}>
        <IconButton
          accessibilityRole="button"
          accessibilityLabel={dining_t('BACK_TO_EVENT')}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color={colors['text-primary']} />
        </IconButton>
        <ThemeText variant="h4">{dining_t('YOUR_BOOKING')}</ThemeText>
        <View style={styles.stepLabel}><ThemeText variant="body5" style={styles.stepText}>{dining_t('STEP_COUNTER')}</ThemeText></View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.eventSummary}>
          <View style={styles.summaryIcon}><Ticket size={19} color={colors['brand-primary']} /></View>
          <View style={styles.summaryCopy}>
            <ThemeText variant="h4" numberOfLines={2}>{event.title}</ThemeText>
            <ThemeText variant="body5" style={styles.secondary}>{event.dateLabel} · {event.venue}</ThemeText>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <ThemeText variant="h3">{dining_t('CHOOSE_SESSION')}</ThemeText>
            <ThemeText variant="body5" style={styles.secondary}>{event.dateLabel}</ThemeText>
          </View>
          <View style={styles.sessionList}>
            {event.sessions.map(option => {
              const selected = session === option;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => setSession(option)}
                  style={[styles.sessionOption, selected && styles.sessionSelected]}
                >
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                  <ThemeText variant="body4" style={selected ? styles.selectedText : undefined}>{option}</ThemeText>
                  {selected ? <Check size={17} color={colors['brand-primary']} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View>
              <ThemeText variant="h3">{dining_t('TICKETS')}</ThemeText>
              <ThemeText variant="body5" style={styles.secondary}>
                {dining_t('PER_PERSON_PRICE', { price: event.price.toLocaleString('en-IN') })}
              </ThemeText>
            </View>
            <View style={styles.quantityControl}>
              <IconButton
                accessibilityRole="button"
                accessibilityLabel={dining_t('REMOVE_TICKET_ACCESSIBILITY')}
                disabled={ticketCount <= 1}
                onPress={() => setTicketCount(count => Math.max(1, count - 1))}
                style={[styles.quantityButton, ticketCount <= 1 && styles.quantityDisabled]}
              >
                <Minus size={17} color={ticketCount <= 1 ? colors['icon-muted'] : colors['text-primary']} />
              </IconButton>
              <ThemeText variant="h4" style={styles.quantity}>{ticketCount}</ThemeText>
              <IconButton
                accessibilityRole="button"
                accessibilityLabel={dining_t('ADD_TICKET_ACCESSIBILITY')}
                disabled={ticketCount >= event.capacity}
                onPress={() => setTicketCount(count => Math.min(event.capacity, count + 1))}
                style={[styles.quantityButton, ticketCount >= event.capacity && styles.quantityDisabled]}
              >
                <Plus size={17} color={ticketCount >= event.capacity ? colors['icon-muted'] : colors['text-primary']} />
              </IconButton>
            </View>
          </View>
          <ThemeText variant="body5" style={styles.capacityNote}>
            {dining_t('CAPACITY_NOTE', { count: event.capacity })}
          </ThemeText>
        </View>

        <View style={styles.section}>
          <ThemeText variant="h3">{dining_t('BOOKING_CONTACT')}</ThemeText>
          <BaseTextInput
            label={dining_t('NAME')}
            placeholder={dining_t('NAME_PLACEHOLDER')}
            value={attendeeName}
            onChangeText={value => { setAttendeeName(value); setError(''); }}
            autoComplete="name"
            textContentType="name"
          />
          <BaseTextInput
            label={dining_t('EMAIL')}
            placeholder="you@example.com"
            value={attendeeEmail}
            onChangeText={value => { setAttendeeEmail(value); setError(''); }}
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          {error ? <ThemeText variant="body5" style={styles.error} accessibilityRole="alert">{error}</ThemeText> : null}
        </View>

        <View style={styles.priceSummary}>
          <View style={styles.priceLine}>
            <ThemeText variant="body5" style={styles.secondary}>
              {ticketCount === 1 ? dining_t('TICKET_COUNT_ONE', { count: ticketCount }) : dining_t('TICKET_COUNT_OTHER', { count: ticketCount })}
            </ThemeText>
            <ThemeText variant="body5">₹{(ticketCount * event.price).toLocaleString('en-IN')}</ThemeText>
          </View>
          <View style={styles.totalLine}>
            <ThemeText variant="h4">{dining_t('TOTAL')}</ThemeText>
            <ThemeText variant="h3">₹{(ticketCount * event.price).toLocaleString('en-IN')}</ThemeText>
          </View>
          <ThemeText variant="body5" style={styles.demoNote}>{dining_t('DEMO_BOOKING_NOTE')}</ThemeText>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <ThemeText variant="body5" style={styles.secondary}>{dining_t('TOTAL')}</ThemeText>
          <ThemeText variant="h3">₹{(ticketCount * event.price).toLocaleString('en-IN')}</ThemeText>
        </View>
        <Pressable accessibilityRole="button" onPress={submitBooking} style={styles.confirmButton}>
          <ThemeText variant="body4" style={styles.confirmText}>{dining_t('CONFIRM_BOOKING')}</ThemeText>
        </Pressable>
      </View>
    </ThemedView>
  );
};

export default EventBooking;