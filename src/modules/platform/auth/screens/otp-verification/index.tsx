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
import { useOtpVerification } from '../../hooks';
import {
  otpVerificationValidatorSchema,
  type OtpVerificationValidatorSchemaType,
} from '../../validators';
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
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<OtpVerificationValidatorSchemaType>({
    resolver: zodResolver(otpVerificationValidatorSchema),
    defaultValues: {
      otp: '',
    },
  });

  const otpValue = watch('otp');

  const onSubmit = async (values: OtpVerificationValidatorSchemaType) => {
    resetError();
    setResendStatus(null);
    try {
      await verifyOtp({ email, otp: values.otp });
      navigation.navigate(EStackScreens.RESET_PASSWORD, { email, otp: values.otp });
    } catch {
      // Error handled by mutation onError
    }
  };

  const handleResend = async () => {
    if (!route.params?.email) return;
    resetError();
    setResendStatus('Resending verification code...');
    try {
      await resendOtp(route.params.email);
      setResendStatus('New verification code sent!');
    } catch {
      setResendStatus(null);
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
              <Controller
                control={control}
                name="otp"
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <BaseTextInput
                    label="Verification Code (OTP)"
                    placeholder="Enter 6-digit code"
                    value={value}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
                      onChange(cleaned);
                    }}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoComplete="one-time-code"
                    maxLength={6}
                    error={fieldError?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <BaseButton
                label={isLoading ? 'Verifying...' : 'Verify Code'}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading || (otpValue?.length ?? 0) < 6}
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default OTPVerification;
