import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import { useNetworkStatus } from '@core/networking/use-network-status.hook';
import { moderateScale } from '@shared/constants/styles.constants';

export interface OfflineBannerProps {
  style?: StyleProp<ViewStyle>;
  position?: 'top' | 'bottom';
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  style,
  position = 'top',
}) => {
  const insets = useSafeAreaInsets();
  const { isOffline, isSyncing, pendingSyncCount, syncNow } = useNetworkStatus();
  const [showSyncedSuccess, setShowSyncedSuccess] = useState(false);
  const prevOfflineRef = useRef(isOffline);
  const translateY = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    // Detect reconnection
    if (prevOfflineRef.current && !isOffline) {
      setShowSyncedSuccess(true);
      const timer = setTimeout(() => {
        setShowSyncedSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    prevOfflineRef.current = isOffline;
  }, [isOffline]);

  const isVisible = isOffline || isSyncing || showSyncedSuccess || pendingSyncCount > 0;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : position === 'top' ? -100 : 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, position, translateY]);

  if (!isVisible) {
    return null;
  }

  const paddingTop = position === 'top' ? Math.max(insets.top, moderateScale(8)) : moderateScale(8);
  const paddingBottom = position === 'bottom' ? Math.max(insets.bottom, moderateScale(8)) : moderateScale(8);

  const getBannerDetails = () => {
    if (isOffline) {
      return {
        bg: '#EF4444',
        textColor: '#FFFFFF',
        icon: <WifiOff size={moderateScale(16)} color="#FFFFFF" />,
        text: pendingSyncCount > 0
          ? `Offline Mode · ${pendingSyncCount} action${pendingSyncCount > 1 ? 's' : ''} queued`
          : 'Offline Mode · Using local cached data',
      };
    }
    if (isSyncing) {
      return {
        bg: '#3B82F6',
        textColor: '#FFFFFF',
        icon: <RefreshCw size={moderateScale(16)} color="#FFFFFF" />,
        text: 'Syncing local changes with server...',
      };
    }
    if (showSyncedSuccess) {
      return {
        bg: '#10B981',
        textColor: '#FFFFFF',
        icon: <CheckCircle2 size={moderateScale(16)} color="#FFFFFF" />,
        text: 'Back Online · All local changes synced',
      };
    }
    return {
      bg: '#F59E0B',
      textColor: '#FFFFFF',
      icon: <RefreshCw size={moderateScale(16)} color="#FFFFFF" />,
      text: `${pendingSyncCount} offline change${pendingSyncCount > 1 ? 's' : ''} ready to sync`,
      action: syncNow,
    };
  };

  const banner = getBannerDetails();

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        {
          backgroundColor: banner.bg,
          paddingTop,
          paddingBottom,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.iconWrapper}>{banner.icon}</View>
        <Text style={[styles.bannerText, { color: banner.textColor }]} numberOfLines={1}>
          {banner.text}
        </Text>
        {banner.action && (
          <TouchableOpacity
            style={styles.syncButton}
            onPress={banner.action}
            accessibilityRole="button"
            accessibilityLabel="Sync queued changes"
          >
            <Text style={styles.syncButtonText}>Sync Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: moderateScale(16),
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  topPosition: {
    top: 0,
  },
  bottomPosition: {
    bottom: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: moderateScale(8),
  },
  bannerText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    flexShrink: 1,
  },
  syncButton: {
    marginLeft: moderateScale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});

