import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {
  Phone,
  MessageSquare,
  Shield,
  RotateCcw,
  Star,
  Clock,
} from 'lucide-react-native';
import { ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { COLORS } from '@shared/constants/colors.constants';
import { EFonts, EFontSize, moderateScale } from '@shared/constants/styles.constants';
import { ITheme } from '@shared/types/theme.types';
import type { TrackingTrip, TripStatus } from '../types/location.types';
import { useAppTranslation } from '@core/i18n';

export interface LiveTrackingCardProps {
  trip: TrackingTrip;
  onChatPress?: () => void;
  onResetPress?: () => void;
}

const getStatusBadgeConfig = (status: TripStatus) => {
  switch (status) {
    case 'assigned':
      return { label: 'DRIVER_ASSIGNED', color: '#64748B', bg: '#F1F5F9' };
    case 'picking_up':
      return { label: 'HEADING_TO_STORE', color: '#D97706', bg: '#FEF3C7' };
    case 'picked_up':
      return { label: 'ORDER_PICKED_UP', color: '#0284C7', bg: '#E0F2FE' };
    case 'on_the_way':
      return { label: 'ON_THE_WAY_TO_YOU', color: '#2563EB', bg: '#DBEAFE' };
    case 'arriving':
      return { label: 'ARRIVING_NOW', color: '#16A34A', bg: '#DCFCE7' };
    case 'completed':
      return { label: 'DELIVERED', color: '#16A34A', bg: '#DCFCE7' };
    default:
      return { label: 'TRACKING_LIVE', color: '#4285F4', bg: '#E8F0FE' };
  }
};

export const LiveTrackingCard: React.FC<LiveTrackingCardProps> = ({
  trip,
  onChatPress,
  onResetPress,
}) => {
  const { theme } = useAppTheme();
  const { common_t } = useAppTranslation();
  const colors = COLORS[theme];
  const styles = styling(theme);

  const badgeConfig = getStatusBadgeConfig(trip.status);

  const handleCallDriver = () => {
    const tel = `tel:${trip.driver.phone}`;
    Linking.canOpenURL(tel).then(supported => {
      if (supported) {
        Linking.openURL(tel);
      } else {
        Alert.alert(common_t('CALL_DRIVER'), common_t('DRIVER_CONTACT_NUMBER', { phone: trip.driver.phone }));
      }
    });
  };

  const progressPercent = Math.min(
    100,
    Math.round(((trip.currentRouteIndex + 1) / trip.routeCoordinates.length) * 100)
  );

  return (
    <View style={styles.cardContainer}>
      {/* Handle bar */}
      <View style={styles.handleBar} />

      {/* Status & ETA Header */}
      <View style={styles.headerRow}>
        <View style={[styles.statusBadge, { backgroundColor: badgeConfig.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: badgeConfig.color }]} />
          <ThemeText style={[styles.statusText, { color: badgeConfig.color }]}>
            {common_t(badgeConfig.label)}
          </ThemeText>
        </View>

        <View style={styles.etaContainer}>
          <Clock size={moderateScale(15)} color={colors['brand-primary']} />
          <ThemeText style={styles.etaText}>
            {trip.status === 'completed'
              ? common_t('ARRIVED')
              : common_t('TRIP_ETA', { minutes: trip.etaMinutes, distance: trip.distanceRemainingKm })}
          </ThemeText>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${progressPercent}%`,
              backgroundColor: colors['brand-primary'],
            },
          ]}
        />
      </View>

      {/* Driver Information Card */}
      <View style={styles.driverSection}>
        <View style={styles.driverAvatar}>
          <ThemeText style={styles.avatarInitials}>
            {trip.driver.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </ThemeText>
        </View>

        <View style={styles.driverInfo}>
          <View style={styles.driverNameRow}>
            <ThemeText style={styles.driverName}>{trip.driver.name}</ThemeText>
            <View style={styles.ratingBadge}>
              <Star size={moderateScale(12)} color="#F59E0B" fill="#F59E0B" />
              <ThemeText style={styles.ratingText}>{trip.driver.rating.toFixed(1)}</ThemeText>
            </View>
          </View>

          <ThemeText style={styles.vehicleDetails}>
            {trip.driver.vehicleModel} • {trip.driver.vehiclePlate}
          </ThemeText>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: colors.border }]}
          onPress={handleCallDriver}
          accessibilityRole="button"
          accessibilityLabel={common_t('CALL_DRIVER')}
        >
          <Phone size={moderateScale(18)} color={colors['text-primary']} />
          <ThemeText style={styles.actionBtnLabel}>{common_t('CALL')}</ThemeText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: colors.border }]}
          onPress={onChatPress}
          accessibilityRole="button"
          accessibilityLabel={common_t('MESSAGE_DRIVER')}
        >
          <MessageSquare size={moderateScale(18)} color={colors['text-primary']} />
          <ThemeText style={styles.actionBtnLabel}>{common_t('MESSAGE')}</ThemeText>
        </TouchableOpacity>

        {onResetPress ? (
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: colors.border }]}
            onPress={onResetPress}
            accessibilityRole="button"
            accessibilityLabel={common_t('RESET_SIMULATION')}
          >
            <RotateCcw size={moderateScale(18)} color={colors['brand-primary']} />
            <ThemeText style={[styles.actionBtnLabel, { color: colors['brand-primary'] }]}>
              {common_t('REPLAY')}
            </ThemeText>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: colors.border }]}
          onPress={() => Alert.alert(common_t('SAFETY_SUPPORT'), common_t('SAFETY_SUPPORT_DESCRIPTION'))}
          accessibilityRole="button"
          accessibilityLabel={common_t('SAFETY_SUPPORT')}
        >
          <Shield size={moderateScale(18)} color={colors['state-danger']} />
          <ThemeText style={[styles.actionBtnLabel, { color: colors['state-danger'] }]}>
            {common_t('HELP')}
          </ThemeText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LiveTrackingCard;

const styling = (theme: ITheme) => StyleSheet.create({
    cardContainer: {
      backgroundColor: COLORS[theme].surface,
      borderTopLeftRadius: moderateScale(24),
      borderTopRightRadius: moderateScale(24),
      paddingHorizontal: moderateScale(20),
      paddingTop: moderateScale(12),
      paddingBottom: moderateScale(24),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8,
    },
    handleBar: {
      width: moderateScale(36),
      height: moderateScale(4),
      borderRadius: moderateScale(2),
      backgroundColor: COLORS[theme].border,
      alignSelf: 'center',
      marginBottom: moderateScale(14),
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: moderateScale(12),
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(4),
      borderRadius: moderateScale(12),
      gap: moderateScale(6),
    },
    statusDot: {
      width: moderateScale(7),
      height: moderateScale(7),
      borderRadius: moderateScale(3.5),
    },
    statusText: {
      fontFamily: EFonts.SEMI_BOLD,
      fontSize: EFontSize.XS,
    },
    etaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(6),
    },
    etaText: {
      fontFamily: EFonts.SEMI_BOLD,
      fontSize: EFontSize.SM,
      color: COLORS[theme]['text-primary'],
    },
    progressBarTrack: {
      height: moderateScale(4),
      backgroundColor: COLORS[theme]['surface-alt'],
      borderRadius: moderateScale(2),
      overflow: 'hidden',
      marginBottom: moderateScale(16),
    },
    progressBarFill: {
      height: '100%',
      borderRadius: moderateScale(2),
    },
    driverSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: moderateScale(18),
    },
    driverAvatar: {
      width: moderateScale(48),
      height: moderateScale(48),
      borderRadius: moderateScale(24),
      backgroundColor: COLORS[theme]['brand-primary'],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: moderateScale(14),
    },
    avatarInitials: {
      fontFamily: EFonts.BOLD,
      fontSize: EFontSize.BASE,
      color: '#FFFFFF',
    },
    driverInfo: {
      flex: 1,
    },
    driverNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: moderateScale(2),
    },
    driverName: {
      fontFamily: EFonts.SEMI_BOLD,
      fontSize: EFontSize.BASE,
      color: COLORS[theme]['text-primary'],
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(3),
    },
    ratingText: {
      fontFamily: EFonts.MEDIUM,
      fontSize: EFontSize.XS,
      color: COLORS[theme]['text-secondary'],
    },
    vehicleDetails: {
      fontFamily: EFonts.REGULAR,
      fontSize: EFontSize.SM,
      color: COLORS[theme]['text-secondary'],
    },
    actionsRow: {
      flexDirection: 'row',
      gap: moderateScale(10),
    },
    actionBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: moderateScale(10),
      borderRadius: moderateScale(12),
      borderWidth: 1,
      gap: moderateScale(6),
      backgroundColor: COLORS[theme].surface,
    },
    actionBtnLabel: {
      fontFamily: EFonts.MEDIUM,
      fontSize: EFontSize.XS,
      color: COLORS[theme]['text-primary'],
    },
  });

