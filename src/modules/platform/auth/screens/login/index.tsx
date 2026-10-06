import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { ThemedView, ThemeText, BaseTextInput, BaseButton } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useSignIn } from '../../hooks';
import { signInValidatorSchema } from '../../schemas/validators';
import { styling } from './styles';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackScreenProps } from '@shared/types/navigation.types';

const Login: React.FC<AppStackScreenProps<EStackScreens.LOGIN>> = ({ navigation }) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const { signIn, isLoading, error, resetError } = useSignIn();
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [validationErrors, setValidationErrors] = useState<{ username?: string; password?: string }>({});

  const handleLogin = async () => {
    resetError();
    const result = signInValidatorSchema.safeParse({ username, password });
    if (!result.success) {
      const fieldErrors: { username?: string; password?: string } = {};
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
    await signIn({ username, password });
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (validationErrors.username) {
      setValidationErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: undefined }));
    }
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
              source={{ uri: 'https://dummyjson.com/icon/emilys/128' }}
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
              <BaseTextInput
                label="Username / Email"
                placeholder="Enter your username or email"
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
                autoComplete="username"
                error={validationErrors.username}
                disabled={isLoading}
              />

              <BaseTextInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                error={validationErrors.password}
                disabled={isLoading}
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
                onPress={handleLogin}
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

            <View style={styles.demoCard}>
              <ThemeText style={[styles.demoText, { color: colors['text-muted'] }]}>
                Demo credentials: emilys / emilyspass
              </ThemeText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default Login;
