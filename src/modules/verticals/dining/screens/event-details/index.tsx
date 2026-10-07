import React from 'react';
import { ImageBackground, Pressable, ScrollView, View } from 'react-native';
import { ArrowLeft, CalendarDays, Check, Clock3, MapPin, Ticket } from 'lucide-react-native';
import { IconButton, ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { getDiningEvent } from '../../api/events.data';
import { EDiningStackScreens } from '../../constants/screens.constants';
import { DiningStackScreenProps } from '../../types/navigation.types';
import { styling } from './styles';

const EventDetails: React.FC<DiningStackScreenProps<EDiningStackScreens.EVENT_DETAILS>> = ({ navigation, route }) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const event = getDiningEvent(route.params.eventId);

  if (!event) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemeText variant="h3">This event is no longer available.</ThemeText>
        <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
          <ThemeText variant="body4" style={styles.linkText}>Go back</ThemeText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ImageBackground source={{ uri: event.imageUrl }} resizeMode="cover" style={styles.hero}>
          <View style={styles.heroShade} />
          <IconButton
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </IconButton>
          <View style={styles.heroCaption}>
            <ThemeText variant="body5" style={styles.category}>{event.category}</ThemeText>
            <ThemeText variant="h1" style={styles.heroTitle}>{event.title}</ThemeText>
            <ThemeText variant="body5" style={styles.host}>Hosted by {event.host}</ThemeText>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <ThemeText variant="body3" style={styles.summary}>{event.summary}</ThemeText>
          <View style={styles.facts}>
            <View style={styles.fact}>
              <CalendarDays size={19} color={colors['brand-primary']} />
              <View style={styles.factCopy}>
                <ThemeText variant="body5" style={styles.factLabel}>DATE & TIME</ThemeText>
                <ThemeText variant="body4">{event.dateLabel} · {event.timeLabel}</ThemeText>
              </View>
            </View>
            <View style={styles.fact}>
              <MapPin size={19} color={colors['brand-primary']} />
              <View style={styles.factCopy}>
                <ThemeText variant="body5" style={styles.factLabel}>LOCATION</ThemeText>
                <ThemeText variant="body4">{event.venue}</ThemeText>
                <ThemeText variant="body5" style={styles.secondary}>{event.neighborhood}</ThemeText>
              </View>
            </View>
            <View style={styles.fact}>
              <Clock3 size={19} color={colors['brand-primary']} />
              <View style={styles.factCopy}>
                <ThemeText variant="body5" style={styles.factLabel}>DURATION</ThemeText>
                <ThemeText variant="body4">{event.duration}</ThemeText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ThemeText variant="h3">The evening</ThemeText>
            <ThemeText variant="body5" style={styles.description}>{event.description}</ThemeText>
          </View>

          <View style={styles.section}>
            <ThemeText variant="h3">Your ticket includes</ThemeText>
            <View style={styles.includesList}>
              {event.includes.map(item => (
                <View key={item} style={styles.includeRow}>
                  <Check size={17} color={colors['state-success']} />
                  <ThemeText variant="body5" style={styles.includeText}>{item}</ThemeText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <ThemeText variant="h3">₹{event.price.toLocaleString('en-IN')}</ThemeText>
          <ThemeText variant="body5" style={styles.secondary}>per person</ThemeText>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate(EDiningStackScreens.EVENT_BOOKING, { eventId: event.id })}
          style={styles.bookButton}
        >
          <Ticket size={18} color="#FFFFFF" />
          <ThemeText variant="body4" style={styles.bookLabel}>Choose tickets</ThemeText>
        </Pressable>
      </View>
    </ThemedView>
  );
};

export default EventDetails