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
import { useRegister } from '../../hooks';
import { registerValidatorSchema } from '../../schemas/validators';
import { styling } from './styles';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackScreenProps } from '@shared/types/navigation.types';

const Register: React.FC<AppStackScreenProps<EStackScreens.REGISTER>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const { register, isLoading, error, resetError } = useRegister();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    resetError();
    setSuccessMessage(null);

    const result = registerValidatorSchema.safeParse({
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setValidationErrors({});
    const response = await register({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    if (response.meta.requestStatus === 'fulfilled') {
      setSuccessMessage('Account created successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigation.navigate(EStackScreens.LOGIN);
      }, 1200);
    }
  };

  const clearFieldError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const navigateToLogin = () => {
    resetError();
    navigation.navigate(EStackScreens.LOGIN);
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader title="Create Account" />
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
            <ThemeText variant="h3" style={styles.title}>Join SuperApp</ThemeText>
            <ThemeText variant="body5" style={[styles.subtitle, { color: colors['text-muted'] }]}>
              Fill in your details below to get started
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
                  <BaseTextInput
                    label="First Name"
                    placeholder="John"
                    value={firstName}
                    onChangeText={text => {
                      setFirstName(text);
                      clearFieldError('firstName');
                    }}
                    autoCapitalize="words"
                    error={validationErrors.firstName}
                    disabled={isLoading}
                  />
                </View>
                <View style={styles.halfInput}>
                  <BaseTextInput
                    label="Last Name"
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={text => {
                      setLastName(text);
                      clearFieldError('lastName');
                    }}
                    autoCapitalize="words"
                    error={validationErrors.lastName}
                    disabled={isLoading}
                  />
                </View>
              </View>

              <BaseTextInput
                label="Username"
                placeholder="Choose a username"
                value={username}
                onChangeText={text => {
                  setUsername(text);
                  clearFieldError('username');
                }}
                autoCapitalize="none"
                autoComplete="username"
                error={validationErrors.username}
                disabled={isLoading}
              />

              <BaseTextInput
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  clearFieldError('email');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={validationErrors.email}
                disabled={isLoading}
              />

              <BaseTextInput
                label="Password"
                placeholder="Enter strong password (min 6 chars)"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  clearFieldError('password');
                }}
                secureTextEntry
                autoCapitalize="none"
                error={validationErrors.password}
                disabled={isLoading}
              />

              <BaseTextInput
                label="Confirm Password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  clearFieldError('confirmPassword');
                }}
                secureTextEntry
                autoCapitalize="none"
                error={validationErrors.confirmPassword}
                disabled={isLoading}
              />

              <BaseButton
                label={isLoading ? 'Creating Account...' : 'Create Account'}
                onPress={handleRegister}
                disabled={isLoading}
                containerStyle={styles.submitButton}
              />
            </View>

            <View style={styles.footerRow}>
              <ThemeText style={[styles.footerText, { color: colors['text-muted'] }]}>
                Already have an account?
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

export default Register;
