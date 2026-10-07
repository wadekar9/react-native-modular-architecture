import React, { useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { ThemeText } from '@shared/components/ui';
import { EmptyStatePage } from '@shared/components/pages';
import { useAppTheme, useSafeAreaInsetsStyle } from '@shared/hooks';
import { EStackScreens } from '@shared/constants/screens.constants';
import type { AppStackScreenProps } from '@shared/types/navigation.types';
import { LiveMapView, LiveTrackingCard } from '../../components';
import { useRealtimeTracking } from '../../hooks';
import { styling } from './styles';
import { moderateScale } from '@shared/constants';

export const LiveTrackingScreen: React.FC<AppStackScreenProps<EStackScreens.LIVE_TRACKING>> = ({
  navigation,
  route,
}) => {
  const { theme, colors } = useAppTheme();
  const styles = useMemo(() => styling(theme), [theme]);
  const { paddingTop } = useSafeAreaInsetsStyle(['top']);

  const tripId = route.params?.tripId;
  const { trip, isLoading } = useRealtimeTracking(tripId);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(EStackScreens.MAIN);
    }
  }, [navigation]);

  const handleChat = useCallback(() => {
    if (!trip?.driver) return;
    Alert.alert(
      'Live Driver Chat',
      `Open chat channel with ${trip.driver.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Chat',
          onPress: () => {
            Alert.alert('Chat Connected', `Connected to ${trip.driver.name}`);
          },
        },
      ]
    );
  }, [trip?.driver]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors['brand-primary']} />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.emptyContainer}>
        <View style={[styles.floatingHeader, { paddingTop: paddingTop + moderateScale(8) }]}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={moderateScale(20)} color={colors['icon-default']} />
          </TouchableOpacity>
        </View>
        <EmptyStatePage
          title="No Active Trip"
          description="There is no active delivery or trip to track at this moment."
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />

      {/* Real-time Map View */}
      <LiveMapView trip={trip} style={StyleSheet.absoluteFill} />

      {/* Floating Header */}
      <View style={[styles.floatingHeader, { paddingTop: paddingTop + moderateScale(8) }]}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={moderateScale(20)} color={colors['icon-default']} />
        </TouchableOpacity>

        <View style={styles.titleBadge}>
          <View style={styles.livePulseDot} />
          <ThemeText style={styles.titleText}>
            {trip.orderId ? `Order ${trip.orderId}` : 'Live Tracking'}
          </ThemeText>
        </View>
      </View>

      {/* Floating Bottom Card */}
      <View style={styles.bottomCardWrapper}>
        <LiveTrackingCard
          trip={trip}
          onChatPress={handleChat}
        />
      </View>
    </View>
  );
};

export default LiveTrackingScreen;
