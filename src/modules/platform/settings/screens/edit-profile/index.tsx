import React from 'react';
import { ThemeText, ThemedView } from '@shared/components/ui';
import { EStackScreens } from '@shared/constants/screens.constants';
import type { AppStackScreenProps } from '@shared/types/navigation.types';
import { styling } from './styles';

const EditProfile: React.FC<AppStackScreenProps<EStackScreens.EDIT_PROFILE>> = () => {
  const styles = styling();

  return (
    <ThemedView style={styles.container}>
      <ThemeText>EditProfile</ThemeText>
    </ThemedView>
  )
}

export default EditProfile
