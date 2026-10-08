import React from 'react';
import { ScrollView, View } from 'react-native';
import { ArrowUpRight, Sparkles } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppTranslation } from '@core/i18n';
import { styling } from './styles';
import { EDiningBottomScreens } from '../../constants/screens.constants';
import { DiningBottomBarScreenProps } from '../../types/navigation.types';
import { DINING_EVENTS } from '../../services/events.data';
import { EventCard } from '../../components';
import { EDiningStackScreens } from '../../constants/screens.constants';

const Events: React.FC<DiningBottomBarScreenProps<EDiningBottomScreens.EVENTS>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const { dining_t } = useAppTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const [featured, ...upcoming] = DINING_EVENTS;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.eyebrow}>
          <Sparkles size={15} color={colors['brand-primary']} />
          <ThemeText variant="body5" style={styles.eyebrowText}>{dining_t('EYEBROW')}</ThemeText>
        </View>
        <View style={styles.headingRow}>
          <View style={styles.headingCopy}>
            <ThemeText variant="h1" style={styles.title}>{dining_t('TITLE')}</ThemeText>
            <ThemeText variant="body5" style={styles.subtitle}>{dining_t('SUBTITLE')}</ThemeText>
          </View>
          <View style={styles.eventCount}>
            <ThemeText variant="h4" style={styles.countText}>{DINING_EVENTS.length}</ThemeText>
            <ThemeText variant="body5" style={styles.countLabel}>{dining_t('UPCOMING')}</ThemeText>
          </View>
        </View>

        {featured ? (
          <>
            <View style={styles.sectionHeader}>
              <ThemeText variant="h3">{dining_t('THIS_WEEKS_TABLE')}</ThemeText>
              <ArrowUpRight size={19} color={colors['icon-default']} />
            </View>
            <EventCard
              event={featured}
              featured
              onPress={() => navigation.navigate(EDiningStackScreens.EVENT_DETAILS, { eventId: featured.id })}
            />
          </>
        ) : null}

        <View style={styles.sectionHeader}>
          <ThemeText variant="h3">{dining_t('COMING_UP')}</ThemeText>
          <ThemeText variant="body5" style={styles.muted}>
            {dining_t('EVENTS_COUNT', { count: upcoming.length })}
          </ThemeText>
        </View>
        <View style={styles.eventList}>
          {upcoming.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate(EDiningStackScreens.EVENT_DETAILS, { eventId: event.id })}
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default Events;
