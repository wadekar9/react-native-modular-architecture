import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';
type AccountDetailsNavigationProp = {
  goBack: () => void;
};
import { useProfileDetails, useSaveProfileDetails } from '../../profile.queries';

const AccountDetails = () => {
  const navigation = useNavigation<AccountDetailsNavigationProp>();
  const { colors } = useAppTheme();
  const user = useAppSelector(state => state.user.user);
  const profileQuery = useProfileDetails();
  const saveProfile = useSaveProfileDetails();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setFirstName(profileQuery.data?.firstName ?? user?.firstName ?? '');
    setLastName(profileQuery.data?.lastName ?? user?.lastName ?? '');
    setEmail(profileQuery.data?.email ?? user?.email ?? '');
    setPhone(profileQuery.data?.phone ?? '');
  }, [profileQuery.data, user]);

  const handleSave = async () => {
    await saveProfile.mutateAsync({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar: profileQuery.data?.avatar ?? user?.avatar,
    });
    navigation.goBack();
  };

  const inputStyle = [styles.input, { borderColor: colors.border, color: colors['text-primary'] }];

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
          <ThemeText variant="body5" style={{ color: colors['brand-primary'] }}>Back</ThemeText>
        </Pressable>
        <ThemeText variant="h2">Account details</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
          Update the details associated with your account.
        </ThemeText>

        <View style={styles.field}>
          <ThemeText variant="body5">First name</ThemeText>
          <TextInput accessibilityLabel="First name" value={firstName} onChangeText={setFirstName} style={inputStyle} />
        </View>
        <View style={styles.field}>
          <ThemeText variant="body5">Last name</ThemeText>
          <TextInput accessibilityLabel="Last name" value={lastName} onChangeText={setLastName} style={inputStyle} />
        </View>
        <View style={styles.field}>
          <ThemeText variant="body5">Email</ThemeText>
          <TextInput accessibilityLabel="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={inputStyle} />
        </View>
        <View style={styles.field}>
          <ThemeText variant="body5">Phone</ThemeText>
          <TextInput accessibilityLabel="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={inputStyle} />
        </View>

        {profileQuery.error || saveProfile.error ? (
          <ThemeText variant="body5" style={{ color: colors['state-danger'] }}>
            {saveProfile.error?.message ?? profileQuery.error?.message}
          </ThemeText>
        ) : null}

        <Pressable accessibilityRole="button" onPress={handleSave} disabled={saveProfile.isPending} style={[styles.save, { backgroundColor: colors['brand-primary'] }]}>
          <ThemeText variant="body5" style={{ color: colors.surface }}>
            {saveProfile.isPending ? 'Saving…' : 'Save details'}
          </ThemeText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, gap: 16 },
  back: { alignSelf: 'flex-start', paddingVertical: 8 },
  field: { gap: 7 },
  input: { minHeight: 48, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 },
  save: { minHeight: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
});

export default AccountDetails;
