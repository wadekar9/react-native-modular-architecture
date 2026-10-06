import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemedView, ThemeText, BaseTextInput, BaseButton } from '@shared/components/ui';
import { AppHeader } from '@shared/components/navigation';
import { useAppTheme } from '@shared/hooks';
import { useResetPassword } from '../../hooks';
import {
  resetPasswordValidatorSchema,
  type ResetPasswordValidatorSchemaType,
} from '../../validators';
import { styling } from './styles';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackScreenProps } from '@shared/types/navigation.types';

const ResetPassword: React.FC<AppStackScreenProps<EStackScreens.RESET_PASSWORD>> = ({
  navigation,
  route,
}) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const email = route.params?.email || '';
  const otp = route.params?.otp || '123456';
  const { resetPassword, isLoading, error, resetError } = useResetPassword();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
  } = useForm<ResetPasswordValidatorSchemaType>({
    resolver: zodResolver(resetPasswordValidatorSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordValidatorSchemaType) => {
    resetError();
    setSuccessMessage(null);
    try {
      await resetPassword({
        email,
        otp,
        newPassword: values.password,
      });
      setSuccessMessage('Password reset successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigation.navigate(EStackScreens.LOGIN);
      }, 1500);
    } catch {
      // Error handled by mutation onError
    }
  };

  const navigateToLogin = () => {
    resetError();
    navigation.navigate(EStackScreens.LOGIN);
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="Reset Password" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <ThemeText variant="h3" style={styles.title}>New Password</ThemeText>
            <ThemeText variant="body5" style={[styles.subtitle, { color: colors['text-muted'] }]}>
              Please set a new password for your account. Make sure it is at least 6 characters long.
            </ThemeText>

            {error ? (
              <View style={styles.errorBanner}>
                <ThemeText style={styles.errorText}>{error}</ThemeText>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successBanner}>
                <ThemeText style={styles.successText}>{successMessage}</ThemeText>
              </View>
            ) : null}

            <View style={styles.form}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <BaseTextInput
                    label="New Password"
                    placeholder="Enter new password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    error={fieldError?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <BaseTextInput
                    label="Confirm New Password"
                    placeholder="Re-enter new password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    error={fieldError?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <BaseButton
                label={isLoading ? 'Updating Password...' : 'Reset Password'}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                containerStyle={styles.submitButton}
              />
            </View>

            <View style={styles.footerRow}>
              <ThemeText style={[styles.footerText, { color: colors['text-muted'] }]}>
                Remember your password?
              </ThemeText>
              <Pressable accessibilityRole="button" onPress={navigateToLogin}>
                <ThemeText style={styles.footerLink}>Sign In</ThemeText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default ResetPassword;
