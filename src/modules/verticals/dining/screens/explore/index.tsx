import React, { useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppTranslation } from '@core/i18n';
import { styling } from './styles';
import { EDiningBottomScreens } from '../../constants/screens.constants';
import { DiningBottomBarScreenProps } from '../../types/navigation.types';
import { DINING_EVENTS, EVENT_CATEGORIES } from '../../services/events.data';
import EventCard from '../../components/event-card.component';
import { EDiningStackScreens } from '../../constants/screens.constants';

const Explore: React.FC<DiningBottomBarScreenProps<EDiningBottomScreens.EXPLORE>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const { dining_t } = useAppTranslation();
  const styles = useMemo(() => styling(theme), [theme]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();
  const events = DINING_EVENTS.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = !normalizedSearch || `${event.title} ${event.venue} ${event.neighborhood} ${event.host}`.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemeText variant="body5" style={styles.eyebrow}>{dining_t('EXPLORE_EYEBROW')}</ThemeText>
        <ThemeText variant="h1" style={styles.title}>{dining_t('EXPLORE_TITLE')}</ThemeText>
        <ThemeText variant="body5" style={styles.subtitle}>{dining_t('EXPLORE_SUBTITLE')}</ThemeText>
      </View>

      <View style={styles.searchBox}>
        <Search size={19} color={colors['icon-muted']} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={dining_t('SEARCH_PLACEHOLDER')}
          placeholderTextColor={colors['text-muted']}
          returnKeyType="search"
          style={styles.searchInput}
          accessibilityLabel={dining_t('SEARCH_LABEL')}
        />
        <SlidersHorizontal size={18} color={colors['icon-default']} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {EVENT_CATEGORIES.map(category => {
          const selected = selectedCategory === category;
          const label = category === 'All' ? dining_t('CATEGORY_ALL') : category;
          return (
            <ThemeText
              key={category}
              variant="body5"
              onPress={() => setSelectedCategory(category)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.categoryChip, selected && styles.categoryChipSelected]}
            >
              {label}
            </ThemeText>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.eventList} showsVerticalScrollIndicator={false}>
        <View style={styles.resultHeader}>
          <ThemeText variant="h3">
            {selectedCategory === 'All' ? dining_t('MADE_FOR_SHARING') : selectedCategory}
          </ThemeText>
          <ThemeText variant="body5" style={styles.resultCount}>
            {events.length === 1 ? dining_t('EVENT_COUNT_ONE', { count: events.length }) : dining_t('EVENT_COUNT_OTHER', { count: events.length })}
          </ThemeText>
        </View>
        {events.length ? events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => navigation.navigate(EDiningStackScreens.EVENT_DETAILS, { eventId: event.id })}
          />
        )) : (
          <View style={styles.emptyState}>
            <ThemeText variant="h4">{dining_t('NO_EVENTS_FOUND')}</ThemeText>
            <ThemeText variant="body5" style={styles.subtitle}>{dining_t('TRY_ANOTHER')}</ThemeText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default Explore;
