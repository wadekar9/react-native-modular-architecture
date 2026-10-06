import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { ThemedView, ThemeText, BaseTextInput, BaseButton } from '@shared/components/ui';
import { AppHeader } from '@shared/components/navigation';
import { useAppTheme } from '@shared/hooks';
import { useResetPassword } from '../../hooks';
import { resetPasswordValidatorSchema } from '../../schemas/validators';
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

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResetPassword = async () => {
    resetError();
    setSuccessMessage(null);

    const result = resetPasswordValidatorSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof typeof fieldErrors;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setValidationErrors({});
    const response = await resetPassword({
      email,
      otp,
      newPassword: password,
    });

    if (response.meta.requestStatus === 'fulfilled') {
      setSuccessMessage('Password reset successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigation.navigate(EStackScreens.LOGIN);
      }, 1500);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (validationErrors.confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
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
              <BaseTextInput
                label="New Password"
                placeholder="Enter new password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                autoCapitalize="none"
                error={validationErrors.password}
                disabled={isLoading}
              />

              <BaseTextInput
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry
                autoCapitalize="none"
                error={validationErrors.confirmPassword}
                disabled={isLoading}
              />

              <BaseButton
                label={isLoading ? 'Updating Password...' : 'Reset Password'}
                onPress={handleResetPassword}
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
