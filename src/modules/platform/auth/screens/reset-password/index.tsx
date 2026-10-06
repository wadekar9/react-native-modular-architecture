import React from 'react';
import { styling } from './styles';
import { useAppTheme } from '@shared/hooks';
import { AppStackScreenProps } from '@shared/types/navigation.types';
import { EStackScreens } from '@shared/constants/screens.constants';
import { ThemedView, ThemeText } from '@shared/components/ui';

const ResetPassword: React.FC<AppStackScreenProps<EStackScreens.RESET_PASSWORD>> = () => {

  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  
  return (
    <ThemedView style={styles.container}>
      <ThemeText>Reset Password</ThemeText>
    </ThemedView>
  )
}

export default ResetPassword
