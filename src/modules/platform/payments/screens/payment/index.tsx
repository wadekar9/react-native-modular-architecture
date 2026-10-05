import React from 'react';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { AppStackScreenProps } from '@shared/types/navigation.types';
import { EStackScreens } from '@shared/constants/screens.constants';

const Payment: React.FC<AppStackScreenProps<EStackScreens.PAYMENT>> = () => {
  return (
    <ThemedView>
      <ThemeText>Payment</ThemeText>
    </ThemedView>
  );
}

export default Payment;