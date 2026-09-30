import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';
type ProfileNavigationProp = {
  navigate: (screen: string) => void;
};

type ProfileProps = {
  onLogout: () => void;
};

const Profile = ({ onLogout }: ProfileProps) => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { colors } = useAppTheme();
  const user = useAppSelector(state => state.user.user);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
      <ThemeText variant="h2">Your account</ThemeText>
      <View style={styles.header}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]} />
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
        <MenuAction label="Account details" detail="Name, email and phone" onPress={() => navigation.navigate('AccountDetails')} />
        <MenuAction label="Notifications" detail="Your recent updates" onPress={() => navigation.navigate('Notifications')} />
        <MenuAction label="Settings" detail="Appearance and preferences" onPress={() => navigation.navigate('Settings')} />
      </View>

      <Pressable accessibilityRole="button" onPress={onLogout} style={styles.logoutButton}>
        <Text style={[styles.logoutText, { color: colors.surface }]}>Log out</Text>
      </Pressable>
      </ScrollView>
    </ThemedView>
  );
};

type MenuActionProps = { label: string; detail: string; onPress: () => void };

const MenuAction = ({ label, detail, onPress }: MenuActionProps) => {
  const { colors } = useAppTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.menuAction, { borderBottomColor: colors.border }]}>
      <View style={styles.menuCopy}>
        <ThemeText variant="body5">{label}</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>{detail}</ThemeText>
      </View>
      <Text style={{ color: colors['text-muted'] }}>›</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E5E7EB',
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileMeta: {
    flex: 1,
    gap: 6,
  },
  menu: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  menuAction: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuCopy: {
    gap: 4,
  },
  logoutButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutText: {
    fontWeight: '700',
  },
});

export default Profile;