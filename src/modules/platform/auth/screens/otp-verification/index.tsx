import React from 'react';
import { styling } from './styles';
import { useAppTheme } from '@shared/hooks';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackScreenProps } from '@shared/types/navigation.types';

const OTPVerification: React.FC<AppStackScreenProps<EStackScreens.OTP_VERIFICATION>> = () => {

  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

    return (
        <ThemedView style={styles.container}>
            <ThemeText>OTPVerification</ThemeText>
        </ThemedView>
    )
}

export default OTPVerification
