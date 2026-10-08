import React from 'react';
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
import { useForgotPassword } from '../../hooks';
import {
  forgotPasswordValidatorSchema,
  type ForgotPasswordValidatorSchemaType,
} from '../../validators';
import { styling } from './styles';
import { EAuthScreens } from '../../constants/screens.constants';
import type { AuthScreenProps } from '../../types/navigation.types';
import { useAppTranslation } from '@core/i18n';

const ForgotPassword: React.FC<AuthScreenProps<EAuthScreens.FORGOT_PASSWORD>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const { auth_t } = useAppTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const { forgotPassword, isLoading, error, resetError } = useForgotPassword();

  const {
    control,
    handleSubmit,
  } = useForm<ForgotPasswordValidatorSchemaType>({
    resolver: zodResolver(forgotPasswordValidatorSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordValidatorSchemaType) => {
    resetError();
    try {
      await forgotPassword(values);
      navigation.navigate(EAuthScreens.OTP_VERIFICATION, { email: values.email });
    } catch {
      // Error handled by mutation onError
    }
  };

  const navigateToLogin = () => {
    resetError();
    navigation.navigate(EAuthScreens.LOGIN);
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader title={auth_t('FORGOT_PASSWORD_TITLE')} />
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
            <ThemeText variant="h3" style={styles.title}>{auth_t('RESET_PASSWORD_HEADING')}</ThemeText>
            <ThemeText variant="body5" style={[styles.subtitle, { color: colors['text-muted'] }]}>
              {auth_t('FORGOT_PASSWORD_SUBTITLE')}
            </ThemeText>

            {error ? (
              <View style={styles.errorBanner}>
                <ThemeText style={styles.errorText}>{error}</ThemeText>
              </View>
            ) : null}

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <BaseTextInput
                    label={auth_t('EMAIL_ADDRESS')}
                    placeholder={auth_t('EMAIL_PLACEHOLDER')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    error={fieldError?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <BaseButton
                label={isLoading ? auth_t('SENDING_CODE') : auth_t('SEND_VERIFICATION_CODE')}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                containerStyle={styles.submitButton}
              />
            </View>

            <View style={styles.footerRow}>
              <ThemeText style={[styles.footerText, { color: colors['text-muted'] }]}>
                {auth_t('REMEMBER_PASSWORD')}
              </ThemeText>
              <Pressable accessibilityRole="button" onPress={navigateToLogin}>
                <ThemeText style={styles.footerLink}>{auth_t('SIGN_IN')}</ThemeText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default ForgotPassword;
