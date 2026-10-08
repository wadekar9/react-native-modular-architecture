import React, { useCallback, useMemo } from 'react';
import {
  View,
  Alert,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { ThemeText } from '@shared/components/ui';
import { IconButton } from '@shared/components/ui';
import { EmptyStatePage } from '@shared/components/pages';
import { useAppTheme, useSafeAreaInsetsStyle } from '@shared/hooks';
import type { LiveTrackingScreenProps } from '../../types/navigation.types';
import { LiveMapView, LiveTrackingCard } from '../../components';
import { useRealtimeTracking } from '../../hooks';
import { styling } from './styles';
import { moderateScale } from '@shared/constants';
import { useAppTranslation } from '@core/i18n';

export const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({
  navigation,
  route,
}) => {
  const { theme, colors } = useAppTheme();
  const { common_t } = useAppTranslation();
  const styles = useMemo(() => styling(theme), [theme]);
  const { paddingTop } = useSafeAreaInsetsStyle(['top']);

  const tripId = route.params?.tripId;
  const { trip, isLoading } = useRealtimeTracking(tripId);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation.navigate as any)('Main');
    }
  }, [navigation]);

  const handleChat = useCallback(() => {
    if (!trip?.driver) return;
    Alert.alert(
      common_t('LIVE_DRIVER_CHAT'),
      common_t('OPEN_CHAT_CONFIRM', { driver: trip.driver.name }),
      [
        { text: common_t('CANCEL'), style: 'cancel' },
        {
          text: common_t('OPEN_CHAT'),
          onPress: () => {
            Alert.alert(common_t('CHAT_CONNECTED'), common_t('CONNECTED_TO_DRIVER', { driver: trip.driver.name }));
          },
        },
      ]
    );
  }, [trip?.driver, common_t]);

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
          <IconButton
            style={styles.headerIconBtn}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel={common_t('GO_BACK')}
          >
            <ArrowLeft size={moderateScale(20)} color={colors['icon-default']} />
          </IconButton>
        </View>
        <EmptyStatePage
          title={common_t('NO_ACTIVE_TRIP')}
          description={common_t('NO_ACTIVE_TRIP_DESCRIPTION')}
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
        <IconButton
          style={styles.headerIconBtn}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={common_t('GO_BACK')}
        >
          <ArrowLeft size={moderateScale(20)} color={colors['icon-default']} />
        </IconButton>

        <View style={styles.titleBadge}>
          <View style={styles.livePulseDot} />
          <ThemeText style={styles.titleText}>
            {trip.orderId ? common_t('ORDER_NUMBER', { orderId: trip.orderId }) : common_t('LIVE_TRACKING')}
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
