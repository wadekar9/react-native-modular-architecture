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
import { useForgotPassword } from '../../hooks';
import { forgotPasswordValidatorSchema } from '../../schemas/validators';
import { styling } from './styles';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackScreenProps } from '@shared/types/navigation.types';

const ForgotPassword: React.FC<AppStackScreenProps<EStackScreens.FORGOT_PASSWORD>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const { forgotPassword, isLoading, error, resetError } = useForgotPassword();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();

  const handleSendCode = async () => {
    resetError();
    const result = forgotPasswordValidatorSchema.safeParse({ email });
    if (!result.success) {
      setEmailError(result.error.issues[0]?.message);
      return;
    }

    setEmailError(undefined);
    const response = await forgotPassword({ email });

    if (response.meta.requestStatus === 'fulfilled') {
      navigation.navigate(EStackScreens.OTP_VERIFICATION, { email });
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError(undefined);
    }
  };

  const navigateToLogin = () => {
    resetError();
    navigation.navigate(EStackScreens.LOGIN);
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="Forgot Password" />
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
            <ThemeText variant="h3" style={styles.title}>Reset Password</ThemeText>
            <ThemeText variant="body5" style={[styles.subtitle, { color: colors['text-muted'] }]}>
              Enter your registered email address and we will send you a 6-digit verification code to reset your password.
            </ThemeText>

            {error ? (
              <View style={styles.errorBanner}>
                <ThemeText style={styles.errorText}>{error}</ThemeText>
              </View>
            ) : null}

            <View style={styles.form}>
              <BaseTextInput
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={emailError}
                disabled={isLoading}
              />

              <BaseButton
                label={isLoading ? 'Sending Code...' : 'Send Verification Code'}
                onPress={handleSendCode}
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

export default ForgotPassword;
