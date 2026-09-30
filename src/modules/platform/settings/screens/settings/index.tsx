import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { isFirebaseConfigured } from '@core/firebase/firebase';
import { registerPushDevice } from '@core/notifications/push.service';
import { useAppSettings, useSaveAppSettings } from '../../settings.queries';
import { DEFAULT_SETTINGS } from '../../settings.service';

const Settings = () => {
  const { colors, changeTheme, selectedTheme } = useAppTheme();
  const settingsQuery = useAppSettings();
  const saveSettings = useSaveAppSettings();
  const [error, setError] = useState<string | null>(null);
  const settings = settingsQuery.data ?? DEFAULT_SETTINGS;

  const updatePreference = async (key: 'pushNotificationsEnabled' | 'emailNotificationsEnabled', value: boolean) => {
    setError(null);
    try {
      if (key === 'pushNotificationsEnabled' && value) {
        const token = await registerPushDevice();
        if (!token) {
          setError('Notification permission was not granted.');
          return;
        }
      }

      await saveSettings.mutateAsync({ ...settings, [key]: value });
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Unable to update this setting.');
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemeText variant="h2">Settings</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
          Preferences apply to this device and your account.
        </ThemeText>

        <View style={styles.section}>
          <ThemeText variant="h4">Appearance</ThemeText>
          <View style={styles.themeOptions}>
            {(['default', 'light', 'dark'] as const).map(theme => {
              const selected = selectedTheme === theme;
              return (
                <Pressable
                  key={theme}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => changeTheme(theme)}
                  style={[
                    styles.themeOption,
                    { borderColor: selected ? colors['brand-primary'] : colors.border },
                    selected && { backgroundColor: colors['brand-primary-soft'] },
                  ]}
                >
                  <ThemeText variant="body5">{theme[0].toUpperCase() + theme.slice(1)}</ThemeText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemeText variant="h4">Notifications</ThemeText>
          <SettingSwitch
            label="Push notifications"
            description="Receive alerts on this device."
            value={settings.pushNotificationsEnabled}
            disabled={settingsQuery.isPending || saveSettings.isPending || !isFirebaseConfigured()}
            onValueChange={value => {
              updatePreference('pushNotificationsEnabled', value);
            }}
          />
          <SettingSwitch
            label="Email notifications"
            description="Receive account updates by email."
            value={settings.emailNotificationsEnabled}
            disabled={settingsQuery.isPending || saveSettings.isPending}
            onValueChange={value => {
              updatePreference('emailNotificationsEnabled', value);
            }}
          />
          {!isFirebaseConfigured() ? (
            <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
              Push notifications become available after Firebase is configured.
            </ThemeText>
          ) : null}
          {error || settingsQuery.error ? (
            <ThemeText variant="body5" style={{ color: colors['state-danger'] }}>
              {error ?? settingsQuery.error?.message}
            </ThemeText>
          ) : null}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

type SettingSwitchProps = {
  label: string;
  description: string;
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
};

const SettingSwitch = ({ label, description, value, disabled, onValueChange }: SettingSwitchProps) => {
  const { colors } = useAppTheme();
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceCopy}>
        <ThemeText variant="body5">{label}</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>{description}</ThemeText>
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors['brand-primary'] }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, gap: 22 },
  section: { gap: 14, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#CBD5E1' },
  themeOptions: { flexDirection: 'row', gap: 10 },
  themeOption: { flex: 1, minHeight: 42, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  preferenceRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  preferenceCopy: { flex: 1, gap: 4 },
});

export default Settings;
