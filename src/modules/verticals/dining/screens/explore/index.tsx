import React, { useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { styling } from './styles';
import { EDiningBottomScreens } from '../../constants/screens.constants';
import { DiningBottomBarScreenProps } from '../../types/navigation.types';
import { DINING_EVENTS, EVENT_CATEGORIES } from '../../api/events.data';
import EventCard from '../../components/event-card.component';
import { EDiningStackScreens } from '../../constants/screens.constants';

const Explore: React.FC<DiningBottomBarScreenProps<EDiningBottomScreens.EXPLORE>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
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
        <ThemeText variant="body5" style={styles.eyebrow}>A SEAT AT THE TABLE</ThemeText>
        <ThemeText variant="h1" style={styles.title}>Explore</ThemeText>
        <ThemeText variant="body5" style={styles.subtitle}>Find a gathering worth slowing down for.</ThemeText>
      </View>

      <View style={styles.searchBox}>
        <Search size={19} color={colors['icon-muted']} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Dish, chef, or neighborhood"
          placeholderTextColor={colors['text-muted']}
          returnKeyType="search"
          style={styles.searchInput}
          accessibilityLabel="Search dining events"
        />
        <SlidersHorizontal size={18} color={colors['icon-default']} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {EVENT_CATEGORIES.map(category => {
          const selected = selectedCategory === category;
          return (
            <ThemeText
              key={category}
              variant="body5"
              onPress={() => setSelectedCategory(category)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.categoryChip, selected && styles.categoryChipSelected]}
            >
              {category}
            </ThemeText>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.eventList} showsVerticalScrollIndicator={false}>
        <View style={styles.resultHeader}>
          <ThemeText variant="h3">{selectedCategory === 'All' ? 'Made for sharing' : selectedCategory}</ThemeText>
          <ThemeText variant="body5" style={styles.resultCount}>{events.length} {events.length === 1 ? 'event' : 'events'}</ThemeText>
        </View>
        {events.length ? events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => navigation.navigate(EDiningStackScreens.EVENT_DETAILS, { eventId: event.id })}
          />
        )) : (
          <View style={styles.emptyState}>
            <ThemeText variant="h4">No events found</ThemeText>
            <ThemeText variant="body5" style={styles.subtitle}>Try another search or category.</ThemeText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default Explore;
