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
import { ThemedScreen, ThemeText } from '@shared/components/ui';
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

const FILTER_ITEMS: { id: NotificationFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'order', label: 'Orders' },
  { id: 'promo', label: 'Promos' },
  { id: 'system', label: 'System' },
];

const NotificationListScreen: React.FC<AppStackScreenProps<EStackScreens.NOTIFICATIONS>> = ({
  navigation,
}) => {
  const { theme, colors } = useAppTheme();
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
      'Clear All Notifications',
      'Are you sure you want to remove all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => clearAllMutation.mutate(),
        },
      ],
    );
  }, [clearAllMutation]);

  const headerRight = useMemo(
    () => (
      <View style={styles.headerRightActions}>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.headerActionBtn}
            accessibilityRole="button"
            accessibilityLabel="Mark all notifications as read"
          >
            <CheckCheck size={moderateScale(20)} color={colors['brand-primary']} />
          </TouchableOpacity>
        )}
        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.headerActionBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear all notifications"
          >
            <Trash2 size={moderateScale(19)} color={colors['icon-destructive']} />
          </TouchableOpacity>
        )}
      </View>
    ),
    [unreadCount, notifications.length, handleMarkAllAsRead, handleClearAll, styles, colors],
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
            let displayLabel = filter.label;
            if (filter.id === 'unread' && unreadCount > 0) {
              displayLabel = `Unread (${unreadCount})`;
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
    [activeFilter, unreadCount, styles],
  );

  const renderEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <BellOff size={moderateScale(56)} color={colors['icon-muted']} />
        <ThemeText style={styles.emptyTitle}>
          {activeFilter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
        </ThemeText>
        <ThemeText style={styles.emptyDescription}>
          {activeFilter === 'unread'
            ? "You've read all your notifications. Great job!"
            : 'When you receive alerts, orders, or updates, they will appear here.'}
        </ThemeText>
      </View>
    ),
    [activeFilter, colors, styles],
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
        title: 'Notifications',
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
