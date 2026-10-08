import React from 'react';
import { ThemedScreen, ThemeText } from '@shared/components/ui';
import { EStackScreens } from '@shared/constants/screens.constants';
import type { AppStackScreenProps } from '@shared/types/navigation.types';
import { useAppTranslation } from '@core/i18n';
import { styling } from './styles';

const EditProfile: React.FC<AppStackScreenProps<EStackScreens.EDIT_PROFILE>> = () => {
  const styles = styling();
  const { nav_t } = useAppTranslation();

  return (
    <ThemedScreen headerProps={{ title: nav_t('EDIT_PROFILE'), showBackButton: true }}>
      <ThemeText style={styles.container}>{nav_t('EDIT_PROFILE')}</ThemeText>
    </ThemedScreen>
  );
};

export default EditProfile;
