import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemedView, ThemeText, BaseTextInput, BaseButton, IconButton } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { IMAGES } from '@shared/assets/images';
import { useSignIn } from '../../hooks';
import {
  signInValidatorSchema,
  type SignInValidatorSchemaType,
} from '../../validators';
import { styling } from './styles';
import { EAuthScreens } from '../../constants/screens.constants';
import { ESettingsScreens } from '../../../settings';
import type { AuthScreenProps } from '../../types/navigation.types';
import { useAppTranslation } from '@core/i18n';
import { Settings2 } from 'lucide-react-native';
import { moderateScale } from '@shared/constants/styles.constants';

const Login: React.FC<AuthScreenProps<EAuthScreens.LOGIN>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const { auth_t } = useAppTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const { signIn, isLoading, error, resetError } = useSignIn();

  const {
    control,
    handleSubmit,
  } = useForm<SignInValidatorSchemaType>({
    resolver: zodResolver(signInValidatorSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInValidatorSchemaType) => {
    resetError();
    await signIn(values);
  };

  const navigateToRegister = () => {
    resetError();
    navigation.navigate(EAuthScreens.REGISTER);
  };

  const navigateToForgotPassword = () => {
    resetError();
    navigation.navigate(EAuthScreens.FORGOT_PASSWORD);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.utilityRow}>
            <IconButton
              accessibilityRole="button"
              accessibilityLabel={auth_t('SETTINGS')}
              onPress={() => navigation.navigate(ESettingsScreens.SETTINGS as any)}
              style={styles.settingsButton}
            >
              <Settings2 size={moderateScale(20)} color={colors['text-primary']} />
            </IconButton>
          </View>
          <View style={styles.card}>
            <Image
              source={IMAGES.REACT}
              style={styles.logo}
            />
            <ThemeText variant="h2" style={styles.title}>SuperApp</ThemeText>
            <ThemeText variant="body5" style={[styles.subtitle, { color: colors['text-muted'] }]}>
              {auth_t('LOGIN_SUBTITLE')}
            </ThemeText>

            {error ? (
              <View style={styles.errorBanner}>
                <ThemeText style={styles.errorText}>{error}</ThemeText>
              </View>
            ) : null}

            <View style={styles.form}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <BaseTextInput
                    label={auth_t('USERNAME_EMAIL_LABEL')}
                    placeholder={auth_t('USERNAME_EMAIL_PLACEHOLDER')}
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
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <BaseTextInput
                    label={auth_t('PASSWORD_LABEL')}
                    placeholder={auth_t('PASSWORD_PLACEHOLDER')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    error={fieldError?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <Pressable
                accessibilityRole="button"
                onPress={navigateToForgotPassword}
                style={styles.forgotPasswordContainer}
              >
                <ThemeText style={styles.forgotPasswordText}>{auth_t('FORGOT_PASSWORD_QUESTION')}</ThemeText>
              </Pressable>

              <BaseButton
                label={isLoading ? auth_t('SIGNING_IN') : auth_t('SIGN_IN')}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                containerStyle={styles.submitButton}
              />
            </View>

            <View style={styles.footerRow}>
              <ThemeText style={[styles.footerText, { color: colors['text-muted'] }]}>
                {auth_t('DONT_HAVE_ACCOUNT_QUESTION')}
              </ThemeText>
              <Pressable accessibilityRole="button" onPress={navigateToRegister}>
                <ThemeText style={styles.footerLink}>{auth_t('SIGN_UP')}</ThemeText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default Login;
