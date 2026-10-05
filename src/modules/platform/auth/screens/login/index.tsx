import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useSignIn } from '../../hooks/use-sign-in.hook';
import { styling } from './styles';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackScreenProps } from '@shared/types/navigation.types';

const Login: React.FC<AppStackScreenProps<EStackScreens.LOGIN>> = () => {

  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const { signIn, isLoading, error } = useSignIn();
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');

  const handleLogin = () => {
    return signIn(username, password);
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
          disabled={isLoading}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors['brand-primary'],
              opacity: pressed || isLoading ? 0.8 : 1,
            },
          ]}
        >
          {isLoading ? (
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

export default Login;
