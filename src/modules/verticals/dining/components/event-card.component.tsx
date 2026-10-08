import React from 'react';
import { ImageBackground, Pressable, View } from 'react-native';
import { CalendarDays, MapPin } from 'lucide-react-native';
import { ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppTranslation } from '@core/i18n';
import type { DiningEvent } from '../types/event.types';
import { styling } from './event-card.styles';

type EventCardProps = {
  event: DiningEvent;
  onPress: () => void;
  featured?: boolean;
};

const EventCard: React.FC<EventCardProps> = ({ event, onPress, featured = false }) => {
  const { colors, theme } = useAppTheme();
  const { dining_t } = useAppTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${event.dateLabel}, ₹${event.price}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, featured && styles.featuredCard, pressed && styles.pressed]}
    >
      <ImageBackground
        source={{ uri: event.imageUrl }}
        style={[styles.image, featured && styles.featuredImage]}
        imageStyle={styles.imageRadius}
        resizeMode="cover"
      >
        <View style={styles.imageShade} />
        <View style={styles.categoryPill}>
          <ThemeText variant="body5" style={styles.categoryText}>{event.category}</ThemeText>
        </View>
        <View style={styles.imageCaption}>
          <ThemeText variant="h2" numberOfLines={2} style={styles.imageTitle}>{event.title}</ThemeText>
          <ThemeText variant="body5" style={styles.imageHost}>
            {dining_t('HOSTED_BY', { host: event.host })}
          </ThemeText>
        </View>
      </ImageBackground>
      <View style={styles.details}>
        <View style={styles.detailLine}>
          <CalendarDays size={16} color={colors['brand-primary']} />
          <ThemeText variant="body5" style={styles.detailText}>{event.dateLabel} · {event.timeLabel}</ThemeText>
        </View>
        <View style={styles.detailLine}>
          <MapPin size={16} color={colors['icon-muted']} />
          <ThemeText variant="body5" numberOfLines={1} style={styles.mutedDetail}>{event.venue} · {event.neighborhood}</ThemeText>
        </View>
        <View style={styles.footer}>
          <ThemeText variant="h4">
            ₹{event.price.toLocaleString('en-IN')}
            <ThemeText variant="body5" style={styles.perTicket}>{dining_t('PER_TICKET')}</ThemeText>
          </ThemeText>
          <ThemeText variant="body5" style={styles.availability}>
            {dining_t('SEATS', { count: event.capacity })}
          </ThemeText>
        </View>
      </View>
    </Pressable>
  );
};

export default EventCard;