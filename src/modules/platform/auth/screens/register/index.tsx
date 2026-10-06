import React from 'react';
import { styling } from './styles';
import { useAppTheme } from '@shared/hooks';
import { AppStackScreenProps } from '@shared/types/navigation.types';
import { EStackScreens } from '@shared/constants/screens.constants';
import { ThemedView, ThemeText } from '@shared/components/ui';

const Register: React.FC<AppStackScreenProps<EStackScreens.REGISTER>> = () => {

  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  
  return (
    <ThemedView style={styles.container}>
      <ThemeText>Register</ThemeText>
    </ThemedView>
  )
}

export default Register
