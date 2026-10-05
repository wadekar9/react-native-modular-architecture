import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '../../notifications.queries';
import type { NotificationItem } from '../../notifications.service';
import type { AppStackScreenProps } from '@shared/types/navigation.types';
import { EStackScreens } from '@shared/constants/screens.constants';

const EmptyNotifications = React.memo(({ textColor }: { textColor: string }) => (
  <View style={emptyStyles.center}>
    <ThemeText variant="h4">You're all caught up</ThemeText>
    <ThemeText variant="body5" style={{ color: textColor }}>
      New account and service updates will appear here.
    </ThemeText>
  </View>
));


const Notifications: React.FC<AppStackScreenProps<EStackScreens.NOTIFICATIONS>> = ({ navigation }) => {

  const { colors } = useAppTheme();
  const styles = React.useMemo(() => styling(colors), [colors]);
  const notificationsQuery = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const notifications = React.useMemo(() => notificationsQuery.data ?? [], [notificationsQuery.data]);
  const unreadCount = React.useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const handlePress = (item: NotificationItem) => {
    if (!item.read) {
      markRead.mutate(item.id);
    }
    if (item.route) {
      navigation.navigate(item.route as never);
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}${item.read ? '' : ', unread'}`}
      onPress={() => handlePress(item)}
      style={[styles.notification, styles.notificationBorder]}
    >
      <View style={[styles.unreadMark, item.read ? styles.unreadMarkRead : styles.unreadMarkActive]} />
      <View style={styles.notificationCopy}>
        <ThemeText variant="body5">{item.title}</ThemeText>
        {item.body ? (
          <ThemeText variant="body5" style={{ color: colors['text-secondary'] }}>
            {item.body}
          </ThemeText>
        ) : null}
        {item.createdAt ? (
          <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
            {item.createdAt.toLocaleString()}
          </ThemeText>
        ) : null}
      </View>
      {!item.read ? <CheckCheck size={18} color={colors['brand-primary']} /> : null}
    </Pressable>
  );

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backButton}>
            <ThemeText variant="body5" style={{ color: colors['brand-primary'] }}>Back</ThemeText>
          </Pressable>
          <ThemeText variant="h2">Notifications</ThemeText>
          <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
            {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}
          </ThemeText>
        </View>
        <View style={styles.headerActions}>
          {unreadCount > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mark all as read"
              onPress={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              style={[styles.actionBtn, { borderColor: colors.border }]}
            >
              <ThemeText variant="body5" style={{ color: colors['brand-primary'] }}>Read all</ThemeText>
            </Pressable>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Refresh notifications"
            onPress={() => notificationsQuery.refetch()}
            disabled={notificationsQuery.isFetching}
            style={[styles.actionBtn, { borderColor: colors.border }]}
          >
            <ThemeText variant="body5" style={{ color: colors['brand-primary'] }}>Refresh</ThemeText>
          </Pressable>
        </View>
      </View>

      {notificationsQuery.isPending ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors['brand-primary']} />
        </View>
      ) : notificationsQuery.error ? (
        <View style={styles.center}>
          <ThemeText variant="h4">Notifications are unavailable</ThemeText>
          <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
            Unable to load notifications. Please check your network connection.
          </ThemeText>
          <Pressable accessibilityRole="button" onPress={() => notificationsQuery.refetch()} style={styles.retry}>
            <ThemeText variant="body5" style={{ color: colors['brand-primary'] }}>Try again</ThemeText>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderNotification}
          refreshing={notificationsQuery.isRefetching}
          onRefresh={() => notificationsQuery.refetch()}
          contentContainerStyle={notifications.length ? styles.list : styles.emptyList}
          ListEmptyComponent={<EmptyNotifications textColor={colors['text-muted']} />}
        />
      )}
    </ThemedView>
  );
};

const emptyStyles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
});

const styling = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    screen: { flex: 1 },
    header: { padding: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    backButton: { paddingBottom: 6 },
    headerActions: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingTop: 20 },
    actionBtn: { minHeight: 36, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, justifyContent: 'center' },
    list: { paddingHorizontal: 20 },
    emptyList: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    notification: {
      minHeight: 78,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
    },
    notificationBorder: { borderBottomColor: colors.border },
    unreadMark: { width: 8, height: 8, borderRadius: 4 },
    unreadMarkActive: { backgroundColor: colors['brand-primary'] },
    unreadMarkRead: { backgroundColor: 'transparent' },
    notificationCopy: { flex: 1, gap: 5 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
    retry: { padding: 10 },
  });

export default Notifications;
