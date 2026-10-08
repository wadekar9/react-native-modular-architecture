import React from 'react';
import { Pressable, View } from 'react-native';
import { Check, CalendarDays, Mail, Ticket } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { getDiningEvent } from '../../services/events.data';
import { EDiningStackScreens } from '../../constants/screens.constants';
import type { DiningStackScreenProps } from '../../types/navigation.types';
import { useDiningTranslation } from '../../hooks';
import { styling } from './styles';

const BookingConfirmation: React.FC<DiningStackScreenProps<EDiningStackScreens.BOOKING_CONFIRMATION>> = ({ navigation, route }) => {
  const { colors, theme } = useAppTheme();
  const { dining_t } = useDiningTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const { eventId, bookingReference, ticketCount, attendeeEmail, session } = route.params;
  const event = getDiningEvent(eventId);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successMark}>
          <Check size={34} color={colors['state-success']} strokeWidth={2.5} />
        </View>
        <ThemeText variant="body5" style={styles.eyebrow}>{dining_t('BOOKING_CONFIRMED')}</ThemeText>
        <ThemeText variant="h1" style={styles.title}>{dining_t('ON_THE_LIST')}</ThemeText>
        <ThemeText variant="body5" style={styles.subtitle}>{dining_t('CONFIRMED_SUBTITLE')}</ThemeText>

        <View style={styles.bookingDetails}>
          <View style={styles.eventHeading}>
            <View style={styles.ticketIcon}><Ticket size={19} color={colors['brand-primary']} /></View>
            <View style={styles.eventCopy}>
              <ThemeText variant="h4">{event?.title ?? 'Dining event'}</ThemeText>
              <ThemeText variant="body5" style={styles.secondary}>{event?.venue ?? ''}</ThemeText>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <CalendarDays size={17} color={colors['icon-muted']} />
            <ThemeText variant="body5" style={styles.detailText}>{event?.dateLabel} · {session}</ThemeText>
          </View>
          <View style={styles.detailRow}>
            <Ticket size={17} color={colors['icon-muted']} />
            <ThemeText variant="body5" style={styles.detailText}>
              {ticketCount === 1 ? dining_t('TICKET_COUNT_ONE', { count: ticketCount }) : dining_t('TICKET_COUNT_OTHER', { count: ticketCount })}
            </ThemeText>
          </View>
          <View style={styles.detailRow}>
            <Mail size={17} color={colors['icon-muted']} />
            <ThemeText variant="body5" style={styles.detailText}>{attendeeEmail}</ThemeText>
          </View>
          <View style={styles.referenceBox}>
            <ThemeText variant="body5" style={styles.referenceLabel}>{dining_t('REFERENCE')}</ThemeText>
            <ThemeText variant="h4" style={styles.reference}>{bookingReference}</ThemeText>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate(EDiningStackScreens.DINING_BOTTOM_NAV)}
        style={styles.doneButton}
      >
        <ThemeText variant="body4" style={styles.doneText}>{dining_t('BACK_TO_DINING')}</ThemeText>
      </Pressable>
    </ThemedView>
  );
};

export default BookingConfirmation;