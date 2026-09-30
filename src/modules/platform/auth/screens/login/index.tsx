import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useSignIn } from '../../hooks/use-sign-in.hook';

const Login: React.FC = () => {
  const { colors } = useAppTheme();
  const signIn = useSignIn();
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      await signIn(username, password);
    } catch (exc: unknown) {
      setError(exc instanceof Error ? exc.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://dummyjson.com/icon/emilys/128' }}
          style={styles.logo}
        />
        <ThemeText variant="h2" style={styles.title}>SuperApp</ThemeText>
        <ThemeText variant="body5" style={styles.subtitle}>
          Sign in with your DummyJSON account
        </ThemeText>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={[styles.input, { borderColor: colors.border, color: colors['text-primary'] }]}
          placeholderTextColor={colors['text-muted']}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { borderColor: colors.border, color: colors['text-primary'] }]}
          placeholderTextColor={colors['text-muted']}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          accessibilityRole="button"
          onPress={handleLogin}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors['brand-primary'],
              opacity: pressed || loading ? 0.8 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.surface }]}>Sign in</Text>
          )}
        </Pressable>

        <Text style={[styles.helperText, { color: colors['text-muted'] }]}>Demo credentials: emilys / emilyspass</Text>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  helperText: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 12,
  },
  error: {
    color: '#DC2626',
    marginBottom: 10,
    fontSize: 12,
  },
});

export default Login;
