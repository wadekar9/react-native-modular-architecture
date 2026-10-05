import React from 'react';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { styling } from './styles';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackScreenProps } from '@shared/types/navigation.types';
import { Image, View } from 'react-native';

const Splash: React.FC<AppStackScreenProps<EStackScreens.SPLASH>> = () => {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

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
        </View>
    </ThemedView>
  );
};

export default Splash;
