import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { useAppSelector } from '@core/store/hooks';
import { IMAGES } from '@shared/assets/images';
import { styling } from './styles';
import { EAuthScreens } from '../../constants/screens.constants';
import type { AuthScreenProps } from '../../types/navigation.types';

const Splash: React.FC<AuthScreenProps<EAuthScreens.SPLASH>> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const isSignedIn = useAppSelector(state => state.session.isSignedIn);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSignedIn) {
        (navigation.replace as any)('Main');
      } else {
        navigation.replace(EAuthScreens.LOGIN);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isSignedIn, navigation]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={IMAGES.REACT}
          style={styles.logo}
        />
        <ThemeText variant="h2" style={styles.title}>SuperApp</ThemeText>
        <ThemeText variant="body5" style={styles.subtitle}>
          Modular React Native SuperApp
        </ThemeText>
      </View>
    </ThemedView>
  );
};

export default Splash;
