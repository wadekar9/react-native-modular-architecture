import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';

type ProfileProps = {
  onLogout: () => void;
};

const Profile = ({ onLogout }: ProfileProps) => {
  const { colors } = useAppTheme();
  const user = useAppSelector(state => state.user.user);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]} />
        )}
        <View style={styles.profileMeta}>
          <ThemeText variant="h3">
            {user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Guest User' : 'Guest User'}
          </ThemeText>
          <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
            {user?.email ?? 'guest@dummyjson.com'}
          </ThemeText>
        </View>
      </View>

      <View style={styles.card}>
        <ThemeText variant="h4">Account</ThemeText>
        <View style={styles.row}>
          <ThemeText variant="body5">Member ID</ThemeText>
          <ThemeText variant="body5">#{user?.id ?? 'N/A'}</ThemeText>
        </View>
        <View style={styles.row}>
          <ThemeText variant="body5">Plan</ThemeText>
          <ThemeText variant="body5">Premium</ThemeText>
        </View>
      </View>

      <View style={styles.card}>
        <ThemeText variant="h4">Quick stats</ThemeText>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <ThemeText variant="h3">12</ThemeText>
            <ThemeText variant="body5">Orders</ThemeText>
          </View>
          <View style={styles.statBox}>
            <ThemeText variant="h3">4.8</ThemeText>
            <ThemeText variant="body5">Rating</ThemeText>
          </View>
          <View style={styles.statBox}>
            <ThemeText variant="h3">$189</ThemeText>
            <ThemeText variant="body5">Savings</ThemeText>
          </View>
        </View>
      </View>

      <Pressable accessibilityRole="button" onPress={onLogout} style={styles.logoutButton}>
        <Text style={{ color: colors.surface, fontWeight: '700' }}>Log out</Text>
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 18,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
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
});

export default Profile;