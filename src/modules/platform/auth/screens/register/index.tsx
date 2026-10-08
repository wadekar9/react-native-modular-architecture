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
import { useRegister } from '../../hooks';
import {
  registerValidatorSchema,
  type RegisterValidatorSchemaType,
} from '../../validators';
import { styling } from './styles';
import { EAuthScreens } from '../../constants/screens.constants';
import type { AuthScreenProps } from '../../types/navigation.types';
import { useAppTranslation } from '@core/i18n';

const Register: React.FC<AuthScreenProps<EAuthScreens.REGISTER>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const { auth_t } = useAppTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const { register, isLoading, error, resetError } = useRegister();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
  } = useForm<RegisterValidatorSchemaType>({
    resolver: zodResolver(registerValidatorSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterValidatorSchemaType) => {
    resetError();
    setSuccessMessage(null);
    try {
      await register({
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
      });
      setSuccessMessage(auth_t('ACCOUNT_CREATED'));
      setTimeout(() => {
        navigation.navigate(EAuthScreens.LOGIN);
      }, 1200);
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
      <AppHeader title={auth_t('REGISTER_TITLE')} />
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
            <ThemeText variant="h3" style={styles.title}>{auth_t('REGISTER_HEADING')}</ThemeText>
            <ThemeText variant="body5" style={[styles.subtitle, { color: colors['text-muted'] }]}>
              {auth_t('REGISTER_SUBTITLE')}
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
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                      <BaseTextInput
                        label={auth_t('FIRST_NAME')}
                        placeholder={auth_t('FIRST_NAME_PLACEHOLDER')}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                        error={fieldError?.message}
                        disabled={isLoading}
                      />
                    )}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                      <BaseTextInput
                        label={auth_t('LAST_NAME')}
                        placeholder={auth_t('LAST_NAME_PLACEHOLDER')}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                        error={fieldError?.message}
                        disabled={isLoading}
                      />
                    )}
                  />
                </View>
              </View>

              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <BaseTextInput
                    label={auth_t('USERNAME')}
                    placeholder={auth_t('USERNAME_PLACEHOLDER')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoComplete="username"
                    error={fieldError?.message}
                    disabled={isLoading}
                  />
                )}
              />

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

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <BaseTextInput
                    label={auth_t('PASSWORD_LABEL')}
                    placeholder={auth_t('STRONG_PASSWORD_PLACEHOLDER')}
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
                    label={auth_t('CONFIRM_PASSWORD')}
                    placeholder={auth_t('REENTER_PASSWORD')}
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
                label={isLoading ? auth_t('CREATING_ACCOUNT') : auth_t('CREATE_ACCOUNT')}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                containerStyle={styles.submitButton}
              />
            </View>

            <View style={styles.footerRow}>
              <ThemeText style={[styles.footerText, { color: colors['text-muted'] }]}>
                {auth_t('ALREADY_HAVE_ACCOUNT_QUESTION')}
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

export default Register;
