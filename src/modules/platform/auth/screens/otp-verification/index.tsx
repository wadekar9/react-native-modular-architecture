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
import { useOtpVerification } from '../../hooks';
import { otpVerificationValidatorSchema } from '../../schemas/validators';
import { styling } from './styles';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackScreenProps } from '@shared/types/navigation.types';

const OTPVerification: React.FC<AppStackScreenProps<EStackScreens.OTP_VERIFICATION>> = ({
  navigation,
  route,
}) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const email = route.params?.email || 'your email address';
  const { verifyOtp, resendOtp, isLoading, error, resetError } = useOtpVerification();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | undefined>();
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleVerify = async () => {
    resetError();
    setResendStatus(null);

    const result = otpVerificationValidatorSchema.safeParse({ otp });
    if (!result.success) {
      setOtpError(result.error.issues[0]?.message);
      return;
    }

    setOtpError(undefined);
    const response = await verifyOtp({ email, otp });

    if (response.meta.requestStatus === 'fulfilled') {
      navigation.navigate(EStackScreens.RESET_PASSWORD, { email, otp });
    }
  };

  const handleResend = async () => {
    if (!route.params?.email) return;
    resetError();
    setResendStatus('Resending verification code...');
    const response = await resendOtp(route.params.email);
    if (response.meta.requestStatus === 'fulfilled') {
      setResendStatus('New verification code sent!');
    } else {
      setResendStatus(null);
    }
  };

  const handleOtpChange = (text: string) => {
    // Keep only digits, up to 6 characters
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(cleaned);
    if (otpError) {
      setOtpError(undefined);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="Verify Code" />
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
            <ThemeText variant="h3" style={styles.title}>Enter Verification Code</ThemeText>
            <ThemeText variant="body5" style={[styles.subtitle, { color: colors['text-muted'] }]}>
              Please enter the 6-digit code sent to{' '}
              <ThemeText style={styles.emailHighlight}>{email}</ThemeText>
            </ThemeText>

            {error ? (
              <View style={styles.errorBanner}>
                <ThemeText style={styles.errorText}>{error}</ThemeText>
              </View>
            ) : null}

            {resendStatus ? (
              <View style={styles.successBanner}>
                <ThemeText style={styles.successText}>{resendStatus}</ThemeText>
              </View>
            ) : null}

            <View style={styles.form}>
              <BaseTextInput
                label="Verification Code (OTP)"
                placeholder="123456"
                value={otp}
                onChangeText={handleOtpChange}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoComplete="one-time-code"
                maxLength={6}
                error={otpError}
                disabled={isLoading}
              />

              <BaseButton
                label={isLoading ? 'Verifying...' : 'Verify Code'}
                onPress={handleVerify}
                disabled={isLoading || otp.length < 6}
                containerStyle={styles.submitButton}
              />
            </View>

            <View style={styles.resendRow}>
              <ThemeText style={[styles.resendText, { color: colors['text-muted'] }]}>
                Didn't receive the code?
              </ThemeText>
              <Pressable accessibilityRole="button" onPress={handleResend} disabled={isLoading}>
                <ThemeText style={styles.resendLink}>Resend</ThemeText>
              </Pressable>
            </View>

            <View style={styles.demoCard}>
              <ThemeText style={[styles.demoText, { color: colors['text-muted'] }]}>
                Demo verification code: 123456
              </ThemeText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default OTPVerification;
