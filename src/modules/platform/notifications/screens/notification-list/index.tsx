import React, { useState, useMemo, useCallback } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckCheck, Trash2, BellOff } from 'lucide-react-native';
import { IconButton, ThemedScreen, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { moderateScale } from '@shared/constants/styles.constants';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackScreenProps } from '@shared/types/navigation.types';
import { NotificationItem } from '../../components';
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useClearAllNotifications,
} from '../../queries';
import type { INotification, NotificationFilter } from '../../types/notification.types';
import { styling } from './styles';
import { useAppTranslation } from '@core/i18n';

const FILTER_ITEMS: { id: NotificationFilter; key: string }[] = [
  { id: 'all', key: 'ALL' },
  { id: 'unread', key: 'UNREAD' },
  { id: 'order', key: 'ORDERS' },
  { id: 'promo', key: 'PROMOS' },
  { id: 'system', key: 'SYSTEM' },
];

const NotificationListScreen: React.FC<AppStackScreenProps<EStackScreens.NOTIFICATIONS>> = ({
  navigation,
}) => {
  const { theme, colors } = useAppTheme();
  const { common_t } = useAppTranslation();
  const styles = useMemo(() => styling(theme), [theme]);

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');

  const {
    data: notifications = [],
    isLoading,
    isRefetching,
    refetch,
  } = useNotifications(activeFilter);
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();
  const clearAllMutation = useClearAllNotifications();

  const handlePressItem = useCallback(
    (item: INotification) => {
      if (!item.isRead) {
        markAsReadMutation.mutate(item.id);
      }
      if (item.route) {
        try {
          (navigation as any).navigate(item.route, item.data);
        } catch {
          // Gracefully ignore route navigation errors if destination not registered
        }
      }
    },
    [markAsReadMutation, navigation],
  );

  const handleDeleteItem = useCallback(
    (item: INotification) => {
      deleteMutation.mutate(item.id);
    },
    [deleteMutation],
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllMutation.mutate();
  }, [markAllMutation]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      common_t('CLEAR_ALL_NOTIFICATIONS'),
      common_t('REMOVE_ALL_NOTIFICATIONS_CONFIRM'),
      [
        { text: common_t('CANCEL'), style: 'cancel' },
        {
          text: common_t('CLEAR_ALL'),
          style: 'destructive',
          onPress: () => clearAllMutation.mutate(),
        },
      ],
    );
  }, [clearAllMutation, common_t]);

  const headerRight = useMemo(
    () => (
      <View style={styles.headerRightActions}>
        {unreadCount > 0 && (
          <IconButton
            onPress={handleMarkAllAsRead}
            style={styles.headerActionBtn}
            accessibilityRole="button"
            accessibilityLabel={common_t('MARK_ALL_NOTIFICATIONS_READ')}
          >
            <CheckCheck size={moderateScale(20)} color={colors['brand-primary']} />
          </IconButton>
        )}
        {notifications.length > 0 && (
          <IconButton
            onPress={handleClearAll}
            style={styles.headerActionBtn}
            accessibilityRole="button"
            accessibilityLabel={common_t('CLEAR_ALL_NOTIFICATIONS_ACCESSIBILITY')}
          >
            <Trash2 size={moderateScale(19)} color={colors['icon-destructive']} />
          </IconButton>
        )}
      </View>
    ),
    [unreadCount, notifications.length, handleMarkAllAsRead, handleClearAll, styles, colors, common_t],
  );

  const renderFilterChips = useMemo(
    () => (
      <View style={styles.filterBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTER_ITEMS.map((filter) => {
            const isActive = activeFilter === filter.id;
            let displayLabel = common_t(filter.key);
            if (filter.id === 'unread' && unreadCount > 0) {
              displayLabel = `${common_t('UNREAD')} (${unreadCount})`;
            }

            return (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <ThemeText
                  style={[styles.filterChipText, isActive && styles.filterChipTextActive]}
                >
                  {displayLabel}
                </ThemeText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    ),
    [activeFilter, unreadCount, styles, common_t],
  );

  const renderEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <BellOff size={moderateScale(56)} color={colors['icon-muted']} />
        <ThemeText style={styles.emptyTitle}>
          {activeFilter === 'unread' ? common_t('NO_UNREAD_NOTIFICATIONS') : common_t('NO_NOTIFICATIONS_YET')}
        </ThemeText>
        <ThemeText style={styles.emptyDescription}>
          {activeFilter === 'unread'
            ? common_t('READ_ALL_NOTIFICATIONS')
            : common_t('NOTIFICATIONS_EMPTY_DESCRIPTION')}
        </ThemeText>
      </View>
    ),
    [activeFilter, colors, styles, common_t],
  );

  const renderItem = useCallback(
    ({ item }: { item: INotification }) => (
      <NotificationItem
        notification={item}
        onPress={handlePressItem}
        onDelete={handleDeleteItem}
      />
    ),
    [handlePressItem, handleDeleteItem],
  );

  const keyExtractor = useCallback((item: INotification) => item.id, []);

  return (
    <ThemedScreen
      headerProps={{
        title: common_t('NOTIFICATIONS'),
        showBackButton: true,
        rightComponent: headerRight,
      }}
    >
      {renderFilterChips}

      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!isLoading ? renderEmptyComponent : null}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors['brand-primary']}
            colors={[colors['brand-primary']]}
          />
        }
      />
    </ThemedScreen>
  );
};

export default NotificationListScreen;
