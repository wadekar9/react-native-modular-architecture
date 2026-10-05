import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { isFirebaseConfigured } from '@core/firebase/firebase';
import type { AppStackScreenProps } from '@shared/types/navigation.types';
import { EStackScreens } from '@shared/constants/screens.constants';
import { useAppSettings, useSaveAppSettings } from '../../settings.queries';
import { DEFAULT_SETTINGS } from '../../settings.service';
import { registerPushDevice, useAddNotification } from '../../../notifications';
import { styling } from './styles';
import SettingSwitch from '../../components/SettingSwitch';

const Settings: React.FC<AppStackScreenProps<EStackScreens.SETTINGS>> = ({ navigation }) => {

  const { theme, colors, changeTheme, selectedTheme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const settingsQuery = useAppSettings();
  const saveSettings = useSaveAppSettings();
  const addNotif = useAddNotification();
  const [error, setError] = useState<string | null>(null);
  const settings = settingsQuery.data ?? DEFAULT_SETTINGS;

  const updatePreference = async (key: 'pushNotificationsEnabled' | 'emailNotificationsEnabled', value: boolean) => {
    setError(null);
    try {
      if (key === 'pushNotificationsEnabled' && value) {
        if (isFirebaseConfigured()) {
          const token = await registerPushDevice();
          if (!token) {
            setError('Notification permission was not granted.');
            return;
          }
        }
      }

      await saveSettings.mutateAsync({ ...settings, [key]: value });
      showMessage({
        message: 'Settings saved',
        description: 'Your preferences have been updated.',
        type: 'success',
      });
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Unable to update this setting.');
    }
  };

  const handleTestNotification = async () => {
    try {
      await addNotif.mutateAsync({
        title: 'Test Notification 🚀',
        body: 'Push and in-app notifications are working properly!',
        route: EStackScreens.NOTIFICATIONS,
      });
      showMessage({
        message: 'Test Notification 🚀',
        description: 'Push and in-app notifications are working properly!',
        type: 'info',
        onPress: () => navigation.navigate(EStackScreens.NOTIFICATIONS),
      });
    } catch {
      setError('Unable to trigger test notification.');
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backButton}>
            <ThemeText variant="body5" style={{ color: colors['brand-primary'] }}>Back</ThemeText>
          </Pressable>
          <ThemeText variant="h2">Settings</ThemeText>
          <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
            Preferences apply to this device and your account.
          </ThemeText>
        </View>

        <View style={styles.section}>
          <ThemeText variant="h4">Appearance</ThemeText>
          <View style={styles.themeOptions}>
            {(['default', 'light', 'dark'] as const).map(themeOption => {
              const selected = selectedTheme === themeOption;
              return (
                <Pressable
                  key={themeOption}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => changeTheme(themeOption)}
                  style={[
                    styles.themeOption,
                    { borderColor: selected ? colors['brand-primary'] : colors.border },
                    selected && { backgroundColor: colors['brand-primary-soft'] },
                  ]}
                >
                  <ThemeText variant="body5">{themeOption[0].toUpperCase() + themeOption.slice(1)}</ThemeText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemeText variant="h4">Notifications & Alerts</ThemeText>

          <SettingSwitch
            label="Push notifications"
            description="Receive real-time alerts on this device."
            value={settings.pushNotificationsEnabled}
            disabled={settingsQuery.isPending || saveSettings.isPending}
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

          <View style={styles.testAlertBox}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Trigger test notification"
              onPress={handleTestNotification}
              style={[styles.testAlertButton, { borderColor: colors['brand-primary'] }]}
            >
              <ThemeText variant="body5" style={{ color: colors['brand-primary'] }}>
                Send Test Alert
              </ThemeText>
            </Pressable>
          </View>

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

export default Settings;
