import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useMarkNotificationRead, useNotifications } from '../../notifications.queries';
import type { NotificationItem } from '../../notifications.service';

const Notifications: React.FC = () => {
    const { colors } = useAppTheme();
    const styles = React.useMemo(() => styling(colors), [colors]);
    const notificationsQuery = useNotifications();
    const markRead = useMarkNotificationRead();
    const notifications = notificationsQuery.data ?? [];

    const renderNotification = ({ item }: { item: NotificationItem }) => (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.title}${item.read ? '' : ', unread'}`}
            disabled={item.read || markRead.isPending}
            onPress={() => markRead.mutate(item.id)}
            style={[styles.notification, styles.notificationBorder]}
        >
            <View style={[styles.unreadMark, item.read ? styles.unreadMarkRead : styles.unreadMarkActive]} />
            <View style={styles.notificationCopy}>
                <ThemeText variant="body5">{item.title}</ThemeText>
                {item.body ? <ThemeText variant="body5" style={{ color: colors['text-secondary'] }}>{item.body}</ThemeText> : null}
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
                    <ThemeText variant="h2">Notifications</ThemeText>
                    <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
                        {notifications.length ? `${notifications.length} recent updates` : 'Your recent updates'}
                    </ThemeText>
                </View>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Refresh notifications"
                    onPress={() => notificationsQuery.refetch()}
                    disabled={notificationsQuery.isFetching}
                    style={[styles.refresh, { borderColor: colors.border }]}
                >
                    <ThemeText variant="body5" style={{ color: colors['brand-primary'] }}>Refresh</ThemeText>
                </Pressable>
            </View>

            {notificationsQuery.isPending ? (
                <View style={styles.center}>
                    <ActivityIndicator color={colors['brand-primary']} />
                </View>
            ) : notificationsQuery.error ? (
                <View style={styles.center}>
                    <ThemeText variant="h4">Notifications are unavailable</ThemeText>
                    <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
                        Configure Firebase and sign in to load your inbox.
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
                    ListEmptyComponent={(
                        <View style={styles.center}>
                            <ThemeText variant="h4">You’re all caught up</ThemeText>
                            <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
                                New account and service updates will appear here.
                            </ThemeText>
                        </View>
                    )}
                />
            )}
        </ThemedView>
    );
};

const styling = (colors: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
    screen: { flex: 1 },
    header: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    refresh: { minHeight: 38, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center' },
    list: { paddingHorizontal: 20 },
    emptyList: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    notification: { minHeight: 78, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
    notificationBorder: { borderBottomColor: colors.border },
    unreadMark: { width: 8, height: 8, borderRadius: 4 },
    unreadMarkActive: { backgroundColor: colors['brand-primary'] },
    unreadMarkRead: { backgroundColor: 'transparent' },
    notificationCopy: { flex: 1, gap: 5 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
    retry: { padding: 10 },
});

export default Notifications;
