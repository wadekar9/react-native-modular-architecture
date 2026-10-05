import React, { useMemo } from 'react';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { styling } from './styles';
import { EDiningBottomScreens } from '../../constants/screens.constants';
import { DiningBottomBarScreenProps } from '../../types/navigation.types';

const Explore : React.FC<DiningBottomBarScreenProps<EDiningBottomScreens.EXPLORE>> = () => {

  const { theme } = useAppTheme();
  const styles = useMemo(() => styling(theme), [theme]);

  return (
    <ThemedView style={styles.container}>
      <ThemeText variant="h2">
        Welcome to the Dining Module Explore Section
      </ThemeText>
    </ThemedView>
  );
}

export default Explore;
