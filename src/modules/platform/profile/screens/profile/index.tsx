import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';

type ProfileProps = {
  onLogout: () => void;
};

const Profile = ({ onLogout }: ProfileProps) => {
  const { colors } = useAppTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemeText>Profile</ThemeText>
      <Pressable accessibilityRole="button" onPress={onLogout}>
        <Text style={{ color: colors['brand-primary'] }}>Log out</Text>
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
});

export default Profile;