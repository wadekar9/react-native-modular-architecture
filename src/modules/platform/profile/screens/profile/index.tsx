import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';
import { useNotifications, type NotificationItem } from '../../../notifications';

type ProfileNavigationProp = {
  navigate: (screen: string) => void;
};

type ProfileProps = {
  onLogout: () => void;
};

const Profile = ({ onLogout }: ProfileProps) => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => styling(colors), [colors]);
  const user = useAppSelector(state => state.user.user);
  const notificationsQuery = useNotifications();
  const unreadCount = notificationsQuery.data?.filter((n: NotificationItem) => !n.read).length ?? 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemeText variant="h2">Your account</ThemeText>
        <View style={styles.header}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <ThemeText variant="h3" style={{ color: colors['text-muted'] }}>
                {(user?.firstName?.[0] ?? 'U').toUpperCase()}
              </ThemeText>
            </View>
          )}
          <View style={styles.profileMeta}>
            <ThemeText variant="h3">
              {user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Account' : 'Account'}
            </ThemeText>
            <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
              {user?.email ?? 'No email on file'}
            </ThemeText>
          </View>
        </View>

        <View style={[styles.menu, { borderColor: colors.border }]}>
          <MenuAction
            label="Account details"
            detail="Name, email and phone"
            onPress={() => navigation.navigate('AccountDetails')}
          />
          <MenuAction
            label="Notifications"
            detail={unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'Your recent updates'}
            badge={unreadCount > 0 ? unreadCount : undefined}
            onPress={() => navigation.navigate('Notifications')}
          />
          <MenuAction
            label="Settings"
            detail="Appearance and preferences"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onLogout}
          style={[styles.logoutButton, { backgroundColor: colors['brand-primary'] }]}
        >
          <Text style={[styles.logoutText, { color: colors.surface }]}>Log out</Text>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
};

type MenuActionProps = {
  label: string;
  detail: string;
  badge?: number;
  onPress: () => void;
};

const MenuAction = ({ label, detail, badge, onPress }: MenuActionProps) => {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[stylesMenu.menuAction, { borderBottomColor: colors.border }]}
    >
      <View style={stylesMenu.menuCopy}>
        <ThemeText variant="body5">{label}</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>{detail}</ThemeText>
      </View>
      <View style={stylesMenu.actionRight}>
        {badge !== undefined ? (
          <View style={[stylesMenu.badge, { backgroundColor: colors['brand-primary'] }]}>
            <Text style={[stylesMenu.badgeText, { color: colors.surface }]}>{badge}</Text>
          </View>
        ) : null}
        <Text style={{ color: colors['text-muted'] }}>›</Text>
      </View>
    </Pressable>
  );
};

const stylesMenu = StyleSheet.create({
  menuAction: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuCopy: {
    gap: 4,
    flex: 1,
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

const styling = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20, gap: 20 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.border },
    avatarFallback: { justifyContent: 'center', alignItems: 'center' },
    profileMeta: { flex: 1, gap: 6 },
    menu: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 14 },
    logoutButton: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    logoutText: { fontWeight: '700' },
  });

export default Profile;