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
import { ThemedView, ThemeText, BaseTextInput, BaseButton } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { IMAGES } from '@shared/assets/images';
import { useSignIn } from '../../hooks';
import {
  signInValidatorSchema,
  type SignInValidatorSchemaType,
} from '../../validators';
import { styling } from './styles';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackScreenProps } from '@shared/types/navigation.types';

const Login: React.FC<AppStackScreenProps<EStackScreens.LOGIN>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
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
    navigation.navigate(EStackScreens.REGISTER);
  };

  const navigateToForgotPassword = () => {
    resetError();
    navigation.navigate(EStackScreens.FORGOT_PASSWORD);
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
          <View style={styles.card}>
            <Image
              source={IMAGES.REACT}
              style={styles.logo}
            />
            <ThemeText variant="h2" style={styles.title}>SuperApp</ThemeText>
            <ThemeText variant="body5" style={[styles.subtitle, { color: colors['text-muted'] }]}>
              Sign in with your account to continue
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
                    label="Username / Email"
                    placeholder="Enter your username or email"
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
                    label="Password"
                    placeholder="Enter your password"
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
                <ThemeText style={styles.forgotPasswordText}>Forgot Password?</ThemeText>
              </Pressable>

              <BaseButton
                label={isLoading ? 'Signing In...' : 'Sign In'}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                containerStyle={styles.submitButton}
              />
            </View>

            <View style={styles.footerRow}>
              <ThemeText style={[styles.footerText, { color: colors['text-muted'] }]}>
                Don't have an account?
              </ThemeText>
              <Pressable accessibilityRole="button" onPress={navigateToRegister}>
                <ThemeText style={styles.footerLink}>Sign Up</ThemeText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default Login;
